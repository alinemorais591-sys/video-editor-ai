import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { TranscriptionResult, Caption } from '../config/types';

const execAsync = promisify(exec);

/**
 * Extrai áudio do vídeo usando FFmpeg
 */
export async function extractAudio(videoPath: string, audioPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${videoPath}" -q:a 9 -n "${audioPath}" 2>&1`;
    exec(command, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

/**
 * Transcreve áudio usando OpenAI Whisper API
 * Retorna timestamps precisos
 */
export async function transcribeWithWhisper(
  audioPath: string,
  language: string = 'pt'
): Promise<TranscriptionResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Ler arquivo de áudio
  const audioBuffer = fs.readFileSync(audioPath);
  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  formData.append('file', blob, 'audio.mp3');
  formData.append('model', 'whisper-1');
  formData.append('language', language);
  formData.append('response_format', 'verbose_json');

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...formData.getHeaders?.(),
        },
      }
    );

    // Processar resposta do Whisper para extrair captions com timestamps
    const segments = response.data.segments || [];
    const captions: Caption[] = segments.map((seg: any, idx: number) => ({
      id: idx,
      index: idx,
      start: Math.round(seg.start),
      end: Math.round(seg.end),
      text: seg.text.trim(),
    }));

    return {
      captions,
      duration: response.data.duration || 0,
      language: language,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Whisper API error: ${error.response?.data?.error?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Transcreve usando Whisper e retorna resultado formatado
 */
export async function transcribeVideo(videoPath: string, workDir: string): Promise<TranscriptionResult> {
  // Extrair áudio
  const audioPath = path.join(workDir, 'audio.mp3');
  console.log('[Transcription] Extracting audio...');
  await extractAudio(videoPath, audioPath);

  // Transcrever
  console.log('[Transcription] Transcribing with Whisper...');
  const result = await transcribeWithWhisper(audioPath);

  // Limpar arquivo temporário
  fs.unlinkSync(audioPath);

  console.log(`[Transcription] Complete: ${result.captions.length} captions extracted`);
  return result;
}

/**
 * Formata captions para exibição (SRT format)
 */
export function formatAsSRT(captions: Caption[]): string {
  return captions
    .map((cap) => {
      const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const millis = Math.round((seconds % 1) * 1000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
      };

      return `${cap.id + 1}\n${formatTime(cap.start)} --> ${formatTime(cap.end)}\n${cap.text}\n`;
    })
    .join('\n');
}

/**
 * Formata captions para o prompt do Claude
 */
export function formatForClaudePrompt(captions: Caption[]): string {
  return captions
    .map((cap) => `[legenda ${cap.index}] ${cap.start.toFixed(1)}s - "${cap.text}"`)
    .join('\n');
}
