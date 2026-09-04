"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Informe um e-mail válido.");
      setLoading(false);
      return;
    }

    if (!isLogin && !name.trim()) {
      setError("Informe seu nome.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Configure o Supabase no arquivo .env.local antes de autenticar.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
      : await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });

    if (result.error) {
      setError(
        isLogin
          ? "E-mail ou senha incorretos."
          : result.error.message.toLowerCase().includes("already registered")
            ? "Este e-mail já está cadastrado."
            : "Não foi possível criar a conta. Verifique os dados e tente novamente."
      );
      setLoading(false);
      return;
    }

    if (!isLogin && !result.data.session) {
      setMessage("Conta criada. Confirme seu e-mail para entrar.");
      setLoading(false);
      return;
    }

    if (isLogin) {
      router.push("/tasks");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold">
        {isLogin ? "Entrar" : "Criar conta"}
      </h1>

      <div className="space-y-1">
        {!isLogin && (
          <>
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
          </>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      {!isLogin && (
        <div className="space-y-1">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirmação de senha
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
      </button>

      <p className="text-center text-sm text-gray-500">
        {isLogin ? (
          <>
            Ainda não possui uma conta?{" "}
            <a href="/signup" className="font-medium text-gray-900 underline">
              Cadastre-se
            </a>
          </>
        ) : (
          <>
            Já possui uma conta?{" "}
            <a href="/login" className="font-medium text-gray-900 underline">
              Entrar
            </a>
          </>
        )}
      </p>
    </form>
  );
}
