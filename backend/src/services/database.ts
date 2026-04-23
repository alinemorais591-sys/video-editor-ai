import Database from 'better-sqlite3';
import * as path from 'path';
import { Job } from '../config/types';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'jobs.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

/**
 * Inicializa o banco de dados
 */
export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      inputPath TEXT NOT NULL,
      outputPath TEXT,
      transcription TEXT,
      analysis TEXT,
      cutInfo TEXT,
      error TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      template TEXT DEFAULT 'custom',
      userPrompt TEXT
    )
  `);

  console.log('[Database] Initialized');
}

/**
 * Cria um novo job
 */
export function createJob(inputPath: string, template: string = 'custom'): Job {
  const id = uuidv4();
  const now = new Date();

  const job: Job = {
    id,
    status: 'queued',
    progress: 0,
    inputPath,
    template,
    createdAt: now,
    updatedAt: now,
  };

  const stmt = db.prepare(`
    INSERT INTO jobs (id, status, progress, inputPath, template, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(job.id, job.status, job.progress, job.inputPath, job.template, job.createdAt, job.updatedAt);

  return job;
}

/**
 * Obtém um job por ID
 */
export function getJob(id: string): Job | null {
  const stmt = db.prepare(`
    SELECT * FROM jobs WHERE id = ?
  `);

  const row = stmt.get(id) as any;
  if (!row) return null;

  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    transcription: row.transcription ? JSON.parse(row.transcription) : undefined,
    analysis: row.analysis ? JSON.parse(row.analysis) : undefined,
    cutInfo: row.cutInfo ? JSON.parse(row.cutInfo) : undefined,
  };
}

/**
 * Atualiza status de um job
 */
export function updateJobStatus(id: string, status: string, progress: number = -1): void {
  const updates = ['status = ?', 'updatedAt = ?'];
  const values: any[] = [status, new Date()];

  if (progress >= 0) {
    updates.push('progress = ?');
    values.push(progress);
  }

  values.push(id);

  const stmt = db.prepare(`
    UPDATE jobs SET ${updates.join(', ')} WHERE id = ?
  `);

  stmt.run(...values);
}

/**
 * Atualiza transcrição de um job
 */
export function updateJobTranscription(id: string, transcription: any): void {
  const stmt = db.prepare(`
    UPDATE jobs SET transcription = ?, updatedAt = ? WHERE id = ?
  `);

  stmt.run(JSON.stringify(transcription), new Date(), id);
}

/**
 * Atualiza análise de um job
 */
export function updateJobAnalysis(id: string, analysis: any): void {
  const stmt = db.prepare(`
    UPDATE jobs SET analysis = ?, updatedAt = ? WHERE id = ?
  `);

  stmt.run(JSON.stringify(analysis), new Date(), id);
}

/**
 * Atualiza cutInfo de um job
 */
export function updateJobCutInfo(id: string, cutInfo: any): void {
  const stmt = db.prepare(`
    UPDATE jobs SET cutInfo = ?, updatedAt = ? WHERE id = ?
  `);

  stmt.run(JSON.stringify(cutInfo), new Date(), id);
}

/**
 * Define erro em um job
 */
export function setJobError(id: string, error: string): void {
  const stmt = db.prepare(`
    UPDATE jobs SET status = ?, error = ?, updatedAt = ? WHERE id = ?
  `);

  stmt.run('failed', error, new Date(), id);
}

/**
 * Completa um job com outputPath
 */
export function completeJob(id: string, outputPath: string): void {
  const stmt = db.prepare(`
    UPDATE jobs SET status = ?, outputPath = ?, progress = ?, updatedAt = ? WHERE id = ?
  `);

  stmt.run('completed', outputPath, 100, new Date(), id);
}

/**
 * Lista todos os jobs (para debugging)
 */
export function listJobs(): Job[] {
  const stmt = db.prepare(`
    SELECT * FROM jobs ORDER BY createdAt DESC LIMIT 10
  `);

  const rows = stmt.all() as any[];
  return rows.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    transcription: row.transcription ? JSON.parse(row.transcription) : undefined,
    analysis: row.analysis ? JSON.parse(row.analysis) : undefined,
    cutInfo: row.cutInfo ? JSON.parse(row.cutInfo) : undefined,
  }));
}

/**
 * Limpa job antigos (mais de 7 dias)
 */
export function cleanupOldJobs(): void {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const stmt = db.prepare(`
    DELETE FROM jobs WHERE createdAt < ? AND status = ?
  `);

  stmt.run(weekAgo, 'completed');
  console.log('[Database] Cleaned up old jobs');
}
