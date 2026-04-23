# ⚡ Quick Start (5 minutos)

## 1️⃣ Configure as Chaves de API

Edite o arquivo `.env` do backend:

```bash
# Windows
notepad backend\.env

# Mac/Linux
nano backend/.env
```

Cole suas chaves:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxx
PORT=3000
NODE_ENV=development
```

**Como obter as chaves:**
- **OpenAI:** https://platform.openai.com/api-keys
- **Claude:** https://console.anthropic.com/

## 2️⃣ Inicie o Backend

```bash
cd backend
npm run dev
```

Você vai ver:
```
🚀 Video Editor Backend running on port 3000
📁 Temp dir: ./temp
📁 Output dir: ./outputs
Server ready!
```

## 3️⃣ Em outro terminal, inicie o Frontend

```bash
cd frontend
npm run dev
```

Você vai ver:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3001
```

## 4️⃣ Abra no Browser

```
http://localhost:3001
```

## 5️⃣ Teste com um Vídeo

1. **Clique em "Arraste ou clique para selecionar"**
2. **Escolha um vídeo pequenininho (30-60 segundos)**
3. **Selecione nicho:** "Odontologia" ou "Artesanato"
4. **Clique em "▶️ Processar Vídeo"**
5. **Acompanhe o status em tempo real**
6. **Quando pronto, veja o resultado!**

---

## 📱 Acessar de Outro Device (Celular)

1. Terminal do backend rodando no seu notebook
2. Terminal do frontend rodando no seu notebook
3. No celular, acesse:
```
http://seu-ip-do-notebook:3001
```

Exemplo: `http://192.168.1.100:3001`

---

## 🎯 O Que Acontece nos Bastidores

```
Backend Pipeline:
1. Upload recebido
2. 🎤 FFmpeg extrai áudio
3. 🎤 OpenAI Whisper transcreve (2-3 min)
4. 🔍 Detecta silêncios
5. 🧠 Claude analisa conteúdo (1-2 min)
6. 🎨 Identifica cores, cenas, formato
7. 📹 FFmpeg renderizaria vídeo final*
```

*Renderização será implementada na próxima phase

---

## ✅ Checklist de Pronto

- ✅ Node.js instalado (`node --version`)
- ✅ FFmpeg instalado (`ffmpeg --version`)
- ✅ Chaves de API configuradas em `.env`
- ✅ Backend rodando em `localhost:3000`
- ✅ Frontend rodando em `localhost:3001`
- ✅ Browser abrindo `localhost:3001`
- ✅ Vídeo sendo processado

---

## 🐛 Se Algo Der Errado

**Erro na porta 3000/3001?**
```bash
# Verificar qual processo está usando
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000
```

**Erro de API Key?**
1. Copie a chave inteira (sem espaços extras)
2. Salve o arquivo `.env`
3. Reinicie o backend

**Vídeo não processa?**
1. Verifique o console do backend (erros de API?)
2. Vá em `http://localhost:3000/api/jobs` para ver detalhes
3. Verifique se o arquivo de vídeo é válido

**Precisa parar?**
```bash
# Pressione Ctrl+C em cada terminal
```

---

## 🎬 Próximo Passo

Depois de testar e validar:
1. Colete mais vídeos de teste do seu nicho
2. Refine os prompts para Claude
3. Implemente renderização real (FFmpeg)
4. Deploy em produção

---

**Tudo funcionando? Parabéns! 🎉**

Sua plataforma de edição automatizada está VIVA! 🚀
