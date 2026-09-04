import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "To-do List",
  description: "Lista de tarefas com autenticação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
