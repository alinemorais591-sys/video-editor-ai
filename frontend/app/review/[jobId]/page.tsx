"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Job {
  id: string;
  status: string;
  progress: number;
  error?: string;
  outputPath?: string;
  transcription?: any;
  analysis?: any;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "details">("preview");

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar job");
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleDownload = () => {
    if (job?.outputPath) {
      const fileName = `video-editado-${jobId}.mp4`;
      const link = document.createElement("a");
      link.href = `/api/download/${jobId}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⚙️</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <h2 className="text-2xl font-bold mb-4">❌ Erro</h2>
          <p className="text-red-700 mb-4">{error || "Job não encontrado"}</p>
          <button
            onClick={() => router.push("/")}
            className="btn-secondary"
          >
            ← Novo Vídeo
          </button>
        </div>
      </div>
    );
  }

  if (job.status !== "completed") {
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Processamento em Andamento</h2>
          <p className="text-gray-600 mb-6">
            O vídeo ainda está sendo processado. Aguarde...
          </p>
          <button
            onClick={() => router.push(`/processing/${jobId}`)}
            className="btn-primary"
          >
            Ver Status
          </button>
        </div>
      </div>
    );
  }

  const captions = job.transcription?.captions || [];
  const scenes = job.analysis?.scenes || [];

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">✅ Vídeo Editado</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {(["preview", "details"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 -mb-[2px] transition ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "preview" ? "📹 Preview" : "📊 Detalhes"}
            </button>
          ))}
        </div>

        {/* Preview Tab */}
        {activeTab === "preview" && (
          <div className="card mb-6">
            <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video flex items-center justify-center">
              <p className="text-white">
                [Video Player - Implementar com Next.js Video ou HTML5]
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="btn-primary flex-1"
              >
                ⬇️ Baixar MP4
              </button>
              <button
                onClick={() => router.push("/")}
                className="btn-secondary flex-1"
              >
                ➕ Editar Novo
              </button>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transcription */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">🎤 Transcrição</h3>
              <div className="max-h-96 overflow-y-auto space-y-2 text-sm">
                {captions.slice(0, 10).map((cap: any) => (
                  <p key={cap.id} className="text-gray-700">
                    <span className="font-medium text-gray-500">{cap.start.toFixed(1)}s:</span> {cap.text}
                  </p>
                ))}
                {captions.length > 10 && (
                  <p className="text-gray-500 text-center py-2">
                    ... {captions.length - 10} mais captions
                  </p>
                )}
              </div>
            </div>

            {/* Analysis */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">🧠 Análise</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Tipo de Vídeo</p>
                  <p className="text-gray-600">{job.analysis?.format || "—"}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Paleta de Cores</p>
                  <div className="flex gap-2 mt-2">
                    {job.analysis?.palette?.map((color: string, idx: number) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Cenas Detectadas</p>
                  <p className="text-gray-600">{scenes.length} cenas</p>
                  <ul className="mt-2 space-y-1">
                    {scenes.slice(0, 5).map((scene: any, idx: number) => (
                      <li key={idx} className="text-gray-600">
                        {idx + 1}. {scene.type}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="btn-secondary inline-block"
          >
            ← Voltar ao Upload
          </button>
        </div>
      </div>
    </div>
  );
}
