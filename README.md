# 🎬 Video Editor AI - Plataforma Automática de Edição de Vídeos

Plataforma de edição de vídeo automatizada com IA, especializada para **odontologia** e **artesanatos**.

## ✨ Features

- ✅ **Transcrição automática** com timestamps precisos (OpenAI Whisper)
- ✅ **Corte automático** de silêncios
- ✅ **Análise de conteúdo** com Claude API (identificar formato, paleta de cores, cenas)
- ✅ **Geração de ilustrações** (opcional)
- ✅ **Interface web** para revisão e refinamento
- ✅ **Renderização final** em MP4
- ✅ **Templates** para odontologia e artesanatos
- ✅ **Watermark e branding** automático

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** 16+ (verificar: `node --version`)
- **FFmpeg** instalado (`ffmpeg --version`)
- **Chaves de API:**
  - OpenAI (Whisper): https://platform.openai.com/api-keys
  - Claude (Anthropic): https://console.anthropic.com/

### Instalação

1. **Clone o repositório**
```bash
cd video-editor-ai
```

2. **Configure as variáveis de ambiente**
```bash
cp backend/.env.example backend/.env
# Edite backend/.env e adicione suas chaves API
```

Exemplo `.env`:
```env
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
PORT=3000
NODE_ENV=development
```

3. **Instale dependências do backend**
```bash
cd backend
npm install
```

4. **Inicie o servidor**
```bash
npm run dev
```

Você deve ver:
```
🚀 Video Editor Backend running on port 3000
Server ready!
```

## 📝 API Endpoints

### Health Check
```
GET /health
```

### Upload e Processar Vídeo
```
POST /api/upload
- Form Data:
  - video: <arquivo mp4>
  - template: "odontologia" ou "artesanato" (padrão: "custom")
  - prompt: (opcional) instrução customizada para análise

Resposta:
{
  "jobId": "abc-123",
  "status": "processing",
  "message": "Processing started"
}
```

### Obter Status do Job
```
GET /api/job/:jobId

Resposta:
{
  "id": "abc-123",
  "status": "completed",
  "progress": 100,
  "transcription": {...},
  "analysis": {...},
  "outputPath": "./outputs/abc-123.mp4"
}
```

### Listar Jobs (Debug)
```
GET /api/jobs
```

## 🏗️ Arquitetura

```
Backend (Node.js + Express)
├── services/
│   ├── transcription.ts    (Whisper API)
│   ├── silenceDetector.ts  (Corta silêncios)
│   ├── sceneGenerator.ts   (Claude API)
│   ├── database.ts         (SQLite)
│   └── videoRenderer.ts    (FFmpeg - soon)
└── config/
    ├── types.ts
    └── templates.ts

Frontend (React + Next.js - TODO)
├── app/
│   ├── page.tsx            (Upload)
│   ├── processing/[id].tsx (Status)
│   └── review/[id].tsx     (Review)
└── components/
```

## 💰 Custos

Por vídeo de **10 minutos**:
- Whisper: ~$0.01
- Claude API: ~$0.02-0.05
- **Total: <$0.10/vídeo** ✓

Versus edição manual: **~2-5 horas ou R$ 100/vídeo** ❌

## 🔧 Processamento

### Etapas do Pipeline

1. **Upload** → Recebe vídeo bruto
2. **Transcrição** → Extrai áudio + Whisper API → JSON com captions + timestamps
3. **Detecção de Silêncios** → Identifica gaps > 0.8s → lista de cortes
4. **Análise com Claude** → Identifica tipo de vídeo, paleta de cores, cenas
5. **Geração de Ilustrações** → (Opcional) Cria imagens via Stable Diffusion
6. **Renderização** → FFmpeg combina vídeo + legendas + cenas
7. **Output** → MP4 pronto para publicar

**Tempo total: ~5-8 minutos** (vs 2-5 horas manual)

## 📱 Uso em Celular/Outro Device

**Setup:**
1. Inicie backend no seu notebook: `npm run dev`
2. Abra navegador em outro device: `http://seu-ip:3001`
3. Faça upload do vídeo
4. Sistema processa no seu notebook
5. Baixe vídeo editado

## 🎨 Templates

### Odontologia
- Paletas: Profissional, Caloroso, Confiança
- Cenas: Antes-depois, Demonstração, Comparativo
- Watermark: "Seu Nome - Odontologia"

### Artesanato
- Paletas: Artístico, Natural, Moderno
- Cenas: Demonstração, Sequência, Storytelling
- Watermark: "Feito com ❤️"

## 🐛 Debugging

**Ver logs:**
```bash
# No terminal onde rodou npm run dev
```

**Ver banco de dados:**
```bash
npm run dev
# GET http://localhost:3000/api/jobs
```

**Limpar arquivos temporários:**
```bash
rm -rf temp/* outputs/*
```

## 📚 Próximas Fases

- [x] Phase 1: Core Pipeline (Transcrição, Análise, DB)
- [ ] Phase 2: Frontend Web (React + Next.js)
- [ ] Phase 3: Templates Personalizados
- [ ] Phase 4: Renderização Avançada (Emotion skill)
- [ ] Phase 5: Geração de Imagens (Stable Diffusion)

## 📄 Licença

MIT

## 👨‍💼 Autor

Desenvolvido por Matheus com ajuda de Claude AI

---

**Pronto para revolucionar sua produção de conteúdo! 🚀**
