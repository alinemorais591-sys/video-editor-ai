import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Editor AI - Edição Automática de Vídeos",
  description: "Plataforma automática de edição de vídeos para odontologia e artesanatos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">🎬 Video Editor AI</h1>
            <div className="flex gap-4">
              <a href="/" className="hover:text-blue-200">Upload</a>
              <a href="/jobs" className="hover:text-blue-200">Meus Vídeos</a>
            </div>
          </div>
        </nav>

        <main className="container">
          {children}
        </main>

        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container text-center">
            <p>© 2025 Video Editor AI. Desenvolvido com IA para seu negócio.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
