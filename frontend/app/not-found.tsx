"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeftCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white px-6">

        <div className="max-w-lg text-center">

          {/* ERROR CODE */}
          <h1 className="text-8xl font-bold text-indigo-500">404</h1>

          {/* TITLE */}
          <h2 className="mt-4 text-2xl font-semibold">
            Página não encontrada
          </h2>

          {/* DESCRIPTION */}
          <p className="mt-3 text-gray-400">
            A página que você está tentando acessar não existe ou foi removida.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Você será redirecionado automaticamente em 10 segundos.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex items-center justify-center gap-4">

            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium transition hover:bg-gray-800"
            >
              <ArrowLeftCircle size={18} />
              Voltar
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
            >
              <Home size={18} />
              Ir para Home
            </button>

          </div>

        </div>

      </div>
    </>
  )
}