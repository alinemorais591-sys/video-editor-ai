import { Template } from './types';

export const templates: Record<string, Template> = {
  odontologia: {
    name: 'Odontologia',
    palettes: [
      {
        name: 'Profissional',
        colors: ['#1a5490', '#ffffff', '#e8f0f7'],
      },
      {
        name: 'Caloroso',
        colors: ['#d97706', '#f59e0b', '#fef3c7'],
      },
      {
        name: 'Confiança',
        colors: ['#059669', '#d1fae5', '#ffffff'],
      },
    ],
    sceneTypes: ['before-after', 'demonstration', 'comparison'],
    music: 'professional-calm',
    watermark: {
      text: 'Seu Nome - Odontologia',
      position: 'bottom-right',
    },
  },

  artesanato: {
    name: 'Artesanato',
    palettes: [
      {
        name: 'Artístico',
        colors: ['#9333ea', '#f59e0b', '#ec4899'],
      },
      {
        name: 'Natural',
        colors: ['#78350f', '#b45309', '#d97706'],
      },
      {
        name: 'Moderno',
        colors: ['#0f172a', '#e2e8f0', '#f43f5e'],
      },
    ],
    sceneTypes: ['demonstration', 'sequence', 'storytelling'],
    music: 'upbeat-creative',
    watermark: {
      text: 'Feito com ❤️',
      position: 'center-bottom',
    },
  },

  custom: {
    name: 'Customizado',
    palettes: [
      {
        name: 'Default',
        colors: ['#3b82f6', '#ffffff', '#f3f4f6'],
      },
    ],
    sceneTypes: ['demonstration', 'comparison', 'side-by-side'],
  },
};

export function getTemplate(name: string): Template {
  return templates[name] || templates.custom;
}
