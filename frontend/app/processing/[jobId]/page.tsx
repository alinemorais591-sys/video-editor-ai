"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Job {
  id: string;
  status: string;
  progress: number;
  error?: string;
  outputPath?: string;
}

const statusMessages = {
  queued: "📋 Aguardando processamento...",
  transcribing: "🎤 Transcrevendo áudio...",
  analyzing: "🧠 Analisando conteúdo...",
  generating: "🎨 Gerando cenas e ilustrações...",
  rendering: "🎬 Renderizando vídeo final...",
  completed: "✅ Processamento completo!",
  failed: "❌ Erro durante processamento",
};

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${apiUrl}/api/job/${jobId}`);

        if (!response.ok) {
          throw new Error("Job não encontrado");
        }

        const data = await response.json();
        setJob(data);
        setLoading(false);

        // Se completado, redirecionar após 2 segundos
        if (data.status === "completed") {
          setTimeout(() => router.push(`/review/${jobId}`), 2000);
        }
        // Se falhou, parar
        else if (data.status !== "failed") {
          // Continuar polling
          setTimeout(fetchJob, 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar job");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⚙️</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <h2 className="text-2xl font-bold mb-4">❌ Erro</h2>
          <p className="text-red-700 mb-4">{error || job?.error}</p>
          <button
            onClick={() => router.push("/")}
            className="btn-secondary"
          >
            ← Voltar ao Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Processando Vídeo</h2>

        {/* Status Message */}
        <div className="text-center mb-8">
          <p className="text-4xl mb-2">
            {job.status === "completed" ? "✅" : "⚙️"}
          </p>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {statusMessages[job.status as keyof typeof statusMessages] || job.status}
          </p>
        </div>

        {/* Progress Bar */}
        {job.status !== "failed" && job.status !== "completed" && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{job.progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing Steps */}
        <div className="space-y-3 mb-8">
          {[
            { key: "transcribing", label: "Transcrição" },
            { key: "analyzing", label: "Análise" },
            { key: "generating", label: "Geração de Cenas" },
            { key: "rendering", label: "Renderização" },
          ].map((step) => {
            const isActive = job.status === step.key;
            const isDone = ["analyzing", "generating", "rendering", "completed"].includes(
              job.status
            );

            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  isActive ? "bg-blue-500 text-white animate-pulse" :
                  isDone ? "bg-green-500 text-white" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  {isDone ? "✓" : "•"}
                </div>
                <span className={isDone ? "text-green-700 font-medium" : "text-gray-600"}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Job ID */}
        <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
          <p>ID do Trabalho: <code className="font-mono">{job.id}</code></p>
        </div>

        {/* Download Button (when completed) */}
        {job.status === "completed" && job.outputPath && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-green-700 mb-4 font-medium">🎉 Seu vídeo está pronto!</p>
            <button
              onClick={() => router.push(`/review/${jobId}`)}
              className="w-full btn-primary"
            >
              Ver Resultado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
