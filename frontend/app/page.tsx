"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [template, setTemplate] = useState("custom");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor selecione um vídeo");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("template", template);
      if (prompt) formData.append("prompt", prompt);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao fazer upload");
      }

      const data = await response.json();
      router.push(`/processing/${data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">🎬 Editar Vídeo com IA</h1>
        <p className="text-center text-gray-600 mb-8">
          Upload seu vídeo bruto e deixe a IA fazer a edição automaticamente
        </p>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Vídeo (MP4, AVI, MOV)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:bg-blue-50 transition"
            >
              <p className="text-blue-600 font-medium">
                {file ? `✓ ${file.name}` : "Arraste ou clique para selecionar"}
              </p>
              <p className="text-sm text-gray-500">Máximo 500MB</p>
            </button>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Nicho</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "odontologia", label: "🦷 Odontologia" },
                { value: "artesanato", label: "🎨 Artesanato" },
                { value: "custom", label: "✨ Customizado" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center">
                  <input
                    type="radio"
                    name="template"
                    value={opt.value}
                    checked={template === opt.value}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="mr-2"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Instrução Customizada (Opcional)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Foque em antes/depois, use cores quentes..."
              className="input h-24 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Enviando..." : "▶️ Processar Vídeo"}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-2xl mb-2">⚡</p>
            <h3 className="font-medium">Rápido</h3>
            <p className="text-sm text-gray-600">5-8 minutos vs 2-5 horas manual</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl mb-2">💰</p>
            <h3 className="font-medium">Barato</h3>
            <p className="text-sm text-gray-600">&lt;$0.10 por vídeo vs R$ 100</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl mb-2">🎨</p>
            <h3 className="font-medium">Profissional</h3>
            <p className="text-sm text-gray-600">Legendas, cenas, animações</p>
          </div>
        </div>
      </div>
    </div>
  );
}
