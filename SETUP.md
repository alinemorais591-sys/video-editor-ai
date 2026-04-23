# 🚀 Setup - Video Editor AI

## 1️⃣ Pré-requisitos

Instale na sua máquina:
- **Node.js 16+** → https://nodejs.org/
- **FFmpeg** → https://ffmpeg.org/download.html
- **Chaves de API:**
  - OpenAI Whisper → https://platform.openai.com/api-keys
  - Claude (Anthropic) → https://console.anthropic.com/

## 2️⃣ Setup Backend

```bash
cd backend
cp .env.example .env
# Edite .env e adicione suas chaves
nano .env
```

Exemplo `.env`:
```env
OPENAI_API_KEY=sk-proj-xxxxx
CLAUDE_API_KEY=sk-ant-xxxxx
PORT=3000
NODE_ENV=development
```

Instalar e iniciar:
```bash
npm install
npm run dev
```

Você deve ver:
```
🚀 Video Editor Backend running on port 3000
Server ready!
```

## 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra browser:
```
http://localhost:3001
```

## 4️⃣ Teste Completo (E2E)

### 1. Abra o frontend
```
http://localhost:3001
```

### 2. Upload um vídeo de teste
- Pegue um vídeo curto (~30 segundos)
- Selecione nicho: "Odontologia" ou "Artesanato"
- Clique "▶️ Processar Vídeo"

### 3. Acompanhe o processamento
- Página automática redireciona para `/processing/{jobId}`
- Mostra progresso em tempo real
- Quando 100%, redireciona para `/review/{jobId}`

### 4. Revise e baixe
- Veja detalhes da transcrição
- Analise cores, cenas detectadas
- Baixe o MP4 quando pronto

## 5️⃣ Arquitetura em Ação

```
You (Celular/Notebook)
        ↓ (envia vídeo bruto)
Frontend (http://localhost:3001)
        ↓ (faz upload)
Backend (http://localhost:3000)
        ├─→ Whisper API (transcrição)
        ├─→ Claude API (análise)
        ├─→ FFmpeg (renderização)
        └─→ SQLite (salva job)
        ↓ (retorna vídeo editado)
You (baixa MP4)
```

## 6️⃣ Estrutura de Pastas

```
video-editor-ai/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── transcription.ts    (Whisper)
│   │   │   ├── silenceDetector.ts  (Corta silêncios)
│   │   │   ├── sceneGenerator.ts   (Claude)
│   │   │   └── database.ts         (SQLite)
│   │   ├── config/
│   │   │   ├── types.ts
│   │   │   └── templates.ts
│   │   └── main.ts (Express)
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── page.tsx               (Upload)
│   │   ├── processing/[jobId]/page.tsx (Status)
│   │   ├── review/[jobId]/page.tsx    (Review)
│   │   └── globals.css
│   ├── package.json
│   └── next.config.ts
└── README.md
```

## 7️⃣ Debugging

### Ver logs do backend
```bash
# Terminal onde rodou npm run dev
# Você verá:
# [Transcription] Extracting audio...
# [Transcription] Transcribing with Whisper...
# [SilenceDetector] Silences found...
# [SceneGenerator] Analysis complete...
```

### Ver jobs salvos
```bash
curl http://localhost:3000/api/jobs
```

### Limpar arquivos temporários
```bash
rm -rf backend/temp/* backend/outputs/*
```

## 8️⃣ Próximos Passos

- [ ] Implementar video renderer (FFmpeg → MP4)
- [ ] Adicionar geração de imagens (Stable Diffusion)
- [ ] Refinar animations em Next.js
- [ ] Deploy em cloud (Railway, Vercel)
- [ ] Melhorar UI/UX
- [ ] Adicionar mais templates

## 9️⃣ Troubleshooting

**Erro: "OPENAI_API_KEY not configured"**
→ Verificar se o arquivo `.env` foi criado no backend/

**Erro: "FFmpeg not found"**
→ Instalar FFmpeg: https://ffmpeg.org/download.html

**Porta 3000 ou 3001 já em uso?**
```bash
# Mudar porta no backend
# backend/.env: PORT=3001

# Mudar porta no frontend
npm run dev -- -p 3002
```

**Vídeo não processa?**
→ Verificar:
1. Terminal do backend mostra erros?
2. Arquivo é válido? (mp4, avi, mov)
3. Chaves de API estão certas?
4. Ver `/api/jobs` para ver detalhes

---

**Sucesso! Sua plataforma está rodando! 🎬✨**

Próximo passo: edite seus vídeos e comece a vender! 💰
