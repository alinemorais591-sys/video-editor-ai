import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as path from 'path';
import * as fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { initDatabase, createJob, getJob, updateJobStatus, setJobError } from './services/database';
import { transcribeVideo } from './services/transcription';
import { generateCutInfo, logCutInfo } from './services/silenceDetector';
import { generateVideoAnalysis } from './services/sceneGenerator';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup directories
const TEMP_DIR = process.env.TEMP_DIR || './temp';
const OUTPUT_DIR = process.env.OUTPUT_DIR || './outputs';

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Multer setup para upload de vídeos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${file.originalname}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 500 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp4|avi|mov|mkv|webm)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

// Inicializar banco de dados
initDatabase();

// ==================== ROUTES ====================

/**
 * Health check
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

/**
 * Upload vídeo e iniciar processamento
 */
app.post('/api/upload', upload.single('video'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file uploaded' });
  }

  try {
    const template = req.body.template || 'custom';
    const userPrompt = req.body.prompt;

    // Criar job
    const job = createJob(req.file.path, template);

    res.json({
      jobId: job.id,
      status: job.status,
      message: 'Processing started',
    });

    // Iniciar processamento em background
    processVideoInBackground(job.id, req.file.path, template, userPrompt);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Obter status do job
 */
app.get('/api/job/:jobId', (req: Request, res: Response) => {
  try {
    const job = getJob(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * Listar jobs (debugging)
 */
app.get('/api/jobs', (req: Request, res: Response) => {
  try {
    const { listJobs } = require('./services/database');
    const jobs = listJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// ==================== BACKGROUND PROCESSING ====================

/**
 * Processa vídeo completo em background
 */
async function processVideoInBackground(
  jobId: string,
  videoPath: string,
  template: string,
  userPrompt?: string
): Promise<void> {
  const workDir = path.join(TEMP_DIR, jobId);
  fs.mkdirSync(workDir, { recursive: true });

  try {
    // Etapa 1: Transcrição
    updateJobStatus(jobId, 'transcribing', 20);
    console.log(`[Job ${jobId}] Starting transcription...`);

    const { updateJobTranscription } = require('./services/database');
    const transcription = await transcribeVideo(videoPath, workDir);
    updateJobTranscription(jobId, transcription);

    // Etapa 2: Análise
    updateJobStatus(jobId, 'analyzing', 40);
    console.log(`[Job ${jobId}] Starting analysis...`);

    const cutInfo = generateCutInfo(transcription.captions);
    logCutInfo(cutInfo);

    const { updateJobCutInfo } = require('./services/database');
    updateJobCutInfo(jobId, cutInfo);

    // Etapa 3: Geração de cenas
    updateJobStatus(jobId, 'generating', 60);
    console.log(`[Job ${jobId}] Generating scenes...`);

    const analysis = await generateVideoAnalysis(transcription.captions, template, userPrompt);

    const { updateJobAnalysis } = require('./services/database');
    updateJobAnalysis(jobId, analysis);

    // Etapa 4: Renderização (por enquanto, apenas marcar como completo)
    updateJobStatus(jobId, 'rendering', 80);
    console.log(`[Job ${jobId}] Would render video here...`);

    // Simular output
    const outputPath = path.join(OUTPUT_DIR, `${jobId}.mp4`);
    fs.writeFileSync(outputPath, 'PLACEHOLDER VIDEO');

    // Completar
    const { completeJob } = require('./services/database');
    completeJob(jobId, outputPath);

    console.log(`[Job ${jobId}] Complete!`);

    // Cleanup
    fs.rmSync(workDir, { recursive: true });
  } catch (error) {
    console.error(`[Job ${jobId}] Error:`, error);
    setJobError(jobId, String(error));

    // Cleanup
    if (fs.existsSync(workDir)) {
      fs.rmSync(workDir, { recursive: true });
    }
  }
}

// ==================== ERROR HANDLING ====================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`\n🚀 Video Editor Backend running on port ${PORT}`);
  console.log(`📁 Temp dir: ${path.resolve(TEMP_DIR)}`);
  console.log(`📁 Output dir: ${path.resolve(OUTPUT_DIR)}`);
  console.log(`\nServer ready!\n`);
});
