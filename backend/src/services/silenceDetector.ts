import { Caption, SilenceInterval, CutInfo } from '../config/types';

/**
 * Detecta silêncios entre as falas analisando as transcrições
 * Critério: gap > SILENCE_THRESHOLD entre captions
 */
export function detectSilences(
  captions: Caption[],
  silenceThreshold: number = 0.8
): SilenceInterval[] {
  const silences: SilenceInterval[] = [];

  for (let i = 0; i < captions.length - 1; i++) {
    const currentEnd = captions[i].end;
    const nextStart = captions[i + 1].start;
    const gap = nextStart - currentEnd;

    if (gap > silenceThreshold) {
      silences.push({
        start: currentEnd,
        end: nextStart,
        duration: gap,
      });
    }
  }

  return silences;
}

/**
 * Calcula quanto tempo foi cortado no total
 */
export function calculateTotalCut(silences: SilenceInterval[]): number {
  return silences.reduce((total, silence) => total + silence.duration, 0);
}

/**
 * Cria mapa de remapeamento de timestamps
 * Exemplo: original 12s → new 10s (cortou 2s antes)
 */
export function createTimeshiftMap(
  captions: Caption[],
  silences: SilenceInterval[]
): Map<number, number> {
  const map = new Map<number, number>();

  // Para cada caption, calcular quanto tempo foi cortado antes dele
  for (const caption of captions) {
    let shift = 0;

    // Somar todos os silêncios que ocorreram antes deste caption
    for (const silence of silences) {
      if (silence.end <= caption.start) {
        shift += silence.duration;
      }
    }

    // Novo timestamp = original - shift
    const newStart = caption.start - shift;
    map.set(caption.start, newStart);
  }

  return map;
}

/**
 * Gera informações completas para corte
 */
export function generateCutInfo(captions: Caption[]): CutInfo {
  const silences = detectSilences(captions);
  const totalCut = calculateTotalCut(silences);
  const timeshiftMap = createTimeshiftMap(captions, silences);

  return {
    silences,
    timeshiftMap,
    totalCut,
  };
}

/**
 * Aplica o timeshift a um timestamp
 * Retorna o novo timestamp após cortes
 */
export function applyTimeshift(original: number, timeshiftMap: Map<number, number>): number {
  // Encontrar o shift acumulado até esse ponto
  let shift = 0;

  // Iterar sobre todos os entries no mapa para encontrar shifts anteriores
  const sortedTimes = Array.from(timeshiftMap.keys()).sort((a, b) => a - b);

  for (const time of sortedTimes) {
    if (time > original) break;
    const mapped = timeshiftMap.get(time) || time;
    shift = time - mapped;
  }

  return original - shift;
}

/**
 * Log de informações sobre os cortes
 */
export function logCutInfo(cutInfo: CutInfo): void {
  console.log('[SilenceDetector] Silences found:');
  cutInfo.silences.forEach((silence, idx) => {
    console.log(`  ${idx + 1}. ${silence.start.toFixed(2)}s - ${silence.end.toFixed(2)}s (${silence.duration.toFixed(2)}s)`);
  });
  console.log(`[SilenceDetector] Total silence duration: ${cutInfo.totalCut.toFixed(2)}s`);
}
