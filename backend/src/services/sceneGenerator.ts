import axios from 'axios';
import { VideoAnalysis, Scene, Template, Caption } from '../config/types';
import { getTemplate } from '../config/templates';
import { formatForClaudePrompt } from './transcription';

/**
 * Gera análise de vídeo usando Claude API
 * Identifica: formato, paleta de cores, tipos de cenas
 */
export async function analyzeVideoWithClaude(
  captions: Caption[],
  template: Template,
  userPrompt?: string
): Promise<VideoAnalysis> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY not configured');
  }

  const captionsText = formatForClaudePrompt(captions);
  const paletteOptions = template.palettes.map((p) => p.name).join(', ');

  // Construir prompt estruturado
  const systemPrompt = `Você é um especialista em edição de vídeos para conteúdo de marketing.
Sua tarefa é analisar uma transcrição de vídeo e propor:
1. Que tipo de vídeo é (7 formatos possíveis)
2. Paleta de cores apropriada
3. 3-5 cenas principais com seus tipos
4. Prompts para geração de ilustrações (ou indicar se é apenas texto)

Tipos de vídeo: demonstration, comparison, authority, sequence, revelation, storytelling, problem-solution
Paletas disponíveis: ${paletteOptions}
Tipos de cenas: full-text, comparison, side-by-side, with-face, whatsapp, animated-number, before-after

RETORNE APENAS JSON, sem texto adicional.`;

  const userMessage = userPrompt
    ? `Análise este vídeo com foco especial em: ${userPrompt}\n\nTranscrição:\n${captionsText}`
    : `Analise este vídeo e gere as cenas:\n\n${captionsText}`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    // Extrair JSON da resposta
    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validar e construir VideoAnalysis
    const analysis: VideoAnalysis = {
      format: parsed.format || 'demonstration',
      palette: parsed.palette || template.palettes[0].colors,
      scenes: (parsed.scenes || []).map((scene: any, idx: number) => ({
        id: `scene-${idx}`,
        type: scene.type || 'demonstration',
        startsAtCaptionIndex: scene.startsAtCaptionIndex || idx * 2,
        endsAtCaptionIndex: scene.endsAtCaptionIndex || (idx + 1) * 2,
        prompt: scene.prompt,
        duration: scene.duration || 5000,
      })),
      music: template.music,
      watermark: template.watermark,
    };

    console.log('[SceneGenerator] Analysis complete:', {
      format: analysis.format,
      sceneCount: analysis.scenes.length,
      palette: analysis.palette,
    });

    return analysis;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.error?.message || error.message;
      throw new Error(`Claude API error: ${errMsg}`);
    }
    throw error;
  }
}

/**
 * Gera análise de vídeo para um nicho específico
 */
export async function generateVideoAnalysis(
  captions: Caption[],
  templateName: string,
  userPrompt?: string
): Promise<VideoAnalysis> {
  const template = getTemplate(templateName);
  console.log('[SceneGenerator] Starting analysis with template:', templateName);

  try {
    const analysis = await analyzeVideoWithClaude(captions, template, userPrompt);
    return analysis;
  } catch (error) {
    console.error('[SceneGenerator] Error:', error);
    // Fallback: gerar análise padrão
    return generateDefaultAnalysis(captions, template);
  }
}

/**
 * Gera análise padrão como fallback
 */
function generateDefaultAnalysis(captions: Caption[], template: Template): VideoAnalysis {
  const sceneCount = Math.min(Math.max(Math.ceil(captions.length / 10), 2), 5);
  const scenes: Scene[] = [];

  for (let i = 0; i < sceneCount; i++) {
    const startIdx = Math.floor((i / sceneCount) * captions.length);
    const endIdx = Math.floor(((i + 1) / sceneCount) * captions.length);

    scenes.push({
      id: `scene-${i}`,
      type: template.sceneTypes[i % template.sceneTypes.length],
      startsAtCaptionIndex: startIdx,
      endsAtCaptionIndex: endIdx,
      prompt: `Cena ${i + 1}: Ilustração para conteúdo de ${template.name}`,
      duration: 5000,
    });
  }

  return {
    format: 'demonstration',
    palette: template.palettes[0].colors,
    scenes,
    music: template.music,
    watermark: template.watermark,
  };
}

/**
 * Refina análise com novo prompt
 */
export async function refineAnalysis(
  captions: Caption[],
  currentAnalysis: VideoAnalysis,
  refinementPrompt: string,
  templateName: string
): Promise<VideoAnalysis> {
  console.log('[SceneGenerator] Refining analysis with prompt:', refinementPrompt);

  const template = getTemplate(templateName);
  const userPrompt = `Refine o vídeo anterior com esta melhoria: ${refinementPrompt}`;

  return generateVideoAnalysis(captions, templateName, userPrompt);
}
