// Transcrição com timestamps
export interface Caption {
  id: number;
  start: number; // em segundos
  end: number;
  text: string;
  index: number;
}

export interface TranscriptionResult {
  captions: Caption[];
  duration: number;
  language: string;
}

// Detecção de silêncios
export interface SilenceInterval {
  start: number;
  end: number;
  duration: number;
}

export interface CutInfo {
  silences: SilenceInterval[];
  timeshiftMap: Map<number, number>; // original time -> new time
  totalCut: number;
}

// Cenas de vídeo
export type SceneType =
  | 'full-text'
  | 'comparison'
  | 'side-by-side'
  | 'with-face'
  | 'whatsapp'
  | 'animated-number'
  | 'before-after';

export type VideoFormat =
  | 'demonstration'
  | 'comparison'
  | 'authority'
  | 'sequence'
  | 'revelation'
  | 'storytelling'
  | 'problem-solution';

export interface Scene {
  id: string;
  type: SceneType;
  startsAtCaptionIndex: number;
  endsAtCaptionIndex: number;
  prompt?: string; // para geração de imagem
  illustrationUrl?: string;
  duration: number; // em ms
}

export interface VideoAnalysis {
  format: VideoFormat;
  palette: string[];
  scenes: Scene[];
  music?: string;
  watermark?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom';
  };
}

// Job (trabalho de edição)
export type JobStatus = 'queued' | 'transcribing' | 'analyzing' | 'generating' | 'rendering' | 'completed' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number; // 0-100
  inputPath: string;
  outputPath?: string;
  transcription?: TranscriptionResult;
  analysis?: VideoAnalysis;
  cutInfo?: CutInfo;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  template: 'odontologia' | 'artesanato' | 'custom';
  userPrompt?: string;
}

// Templates por nicho
export interface Template {
  name: string;
  palettes: Array<{
    name: string;
    colors: string[];
  }>;
  sceneTypes: SceneType[];
  music?: string;
  watermark?: {
    text: string;
    position: string;
  };
}
