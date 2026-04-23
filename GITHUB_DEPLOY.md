# 🚀 Deploy Online via GitHub + Vercel + Railway

## 📋 Pré-requisitos
- ✅ Conta GitHub (você já tem)
- ⏳ Conta Vercel (5 min, grátis)
- ⏳ Conta Railway (5 min, grátis)

---

## PASSO 1️⃣: Criar Repositório no GitHub

1. Abra https://github.com/new
2. Nome do repositório: `video-editor-ai`
3. Descrição: `Plataforma automática de edição de vídeos com IA`
4. Selecione: **Public** (para deploy grátis)
5. Clique **Create repository**

Você vai ver uma página com comandos. **Copie e execute NO SEU TERMINAL:**

```bash
cd ~/OneDrive/Documentos/aline/video-editor-ai

# Copie EXATAMENTE esses comandos da página GitHub:
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/video-editor-ai.git
git push -u origin main
```

**Pronto!** Seu código está no GitHub! ✅

---

## PASSO 2️⃣: Deploy Frontend (Vercel)

1. Abra https://vercel.com/new
2. **Sign up with GitHub** (ou login se já tem)
3. Autorize Vercel a acessar GitHub
4. Procure `video-editor-ai` na lista
5. **Selecione o repositório**

**Configurar projeto:**
- Framework Preset: **Next.js**
- Root Directory: `frontend/` ⭐ **IMPORTANTE!**
- Clique **Deploy**

**Aguarde 2-3 minutos...**

Quando terminar, você vai receber um link tipo:
```
https://video-editor-ai.vercel.app
```

**Guarde esse link!** Esse é seu **Frontend** 🎨

---

## PASSO 3️⃣: Deploy Backend (Railway)

1. Abra https://railway.app
2. **Sign up with GitHub** (ou login)
3. **New Project**
4. **Deploy from GitHub repo**
5. **Selecione** `seu_usuario/video-editor-ai`
6. **Select root directory:** `backend/` ⭐ **IMPORTANTE!**
7. **Deploy**

**Configurar Environment Variables:**

Clique no projeto → **Variables**

Adicione essas variáveis:
```
OPENAI_API_KEY=sk-proj-xxxxx (sua chave)
CLAUDE_API_KEY=sk-ant-xxxxx (sua chave)
NODE_ENV=production
PORT=3000
```

**Salve e aguarde o deploy completar...**

Quando terminar, você terá um link tipo:
```
https://video-editor-ai-production.up.railway.app
```

**Guarde esse link!** Esse é seu **Backend** 🔧

---

## PASSO 4️⃣: Conectar Frontend ao Backend

Seu frontend precisa saber onde está o backend!

1. Vá para **Vercel** → seu projeto
2. Clique em **Settings**
3. **Environment Variables**
4. Adicione:
   ```
   NEXT_PUBLIC_API_URL=https://video-editor-ai-production.up.railway.app
   ```
5. Clique **Redeploy** (para aplicar a mudança)

**Aguarde 2-3 minutos...**

---

## ✅ PRONTO! Seu Link Está Online!

Abra no navegador:
```
https://seu-frontend.vercel.app
```

E comece a editar vídeos! 🎬

---

## 📱 Acessar de Qualquer Lugar

O link funciona em:
- ✅ Celular
- ✅ Tablet
- ✅ Outro notebook
- ✅ Qualquer dispositivo com navegador

Basta compartilhar o link!

---

## 🔧 Se Algo Der Errado

**Frontend não carrega?**
1. Vá em Vercel → Deployments
2. Verifique se o deploy completou (✅ verde)
3. Se houver erro (❌ vermelho), clique para ver logs

**Backend retorna erro?**
1. Vá em Railway → seu projeto
2. Clique em **Logs**
3. Procure pelo erro
4. Verifique se as API keys estão corretas

**Onde meus vídeos são salvos?**
- Temporário (durante processamento): Cloud storage do Railway
- Saída final: Você baixa direto do navegador

---

## 💡 Pro Tips

**Atualizar código online:**
```bash
# Faça mudanças localmente
git add .
git commit -m "Update: [sua mensagem]"
git push origin main

# Vercel e Railway vão redeploy automaticamente! ✨
```

**Ver logs em tempo real:**
- **Vercel:** Deployments → Logs
- **Railway:** Logs (aba principal)

---

## 🎉 Parabéns!

Sua plataforma de edição de vídeos está **VIVA NA INTERNET**! 🚀

Compartilhe o link com seus clientes e comece a vender! 💰

---

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os **Logs** (Vercel/Railway)
2. Confirme as **API keys**
3. Teste localmente primeiro (`npm run dev`)

**Sucesso! 🎬✨**
