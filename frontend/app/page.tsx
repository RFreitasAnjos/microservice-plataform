export default function Home() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white px-6">

        <div className="max-w-lg text-center">

          {/* TITLE */}
          <h1 className="text-4xl font-bold text-indigo-500">Bem-vindo à My Microservices Platform</h1>

          {/* DESCRIPTION */}
          <p className="mt-4 text-gray-400">
            Explore nossos microserviços e descubra como podemos ajudar a impulsionar seu negócio.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex items-center justify-center gap-4">

            <a
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold transition hover:bg-indigo-500"
            >
              Acessar Dashboard
            </a>

            <a
              href="/settings"
              className="flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium transition hover:bg-gray-800"
            >
              Configurações
            </a>

          </div>

        </div>

      </div>
    </>
  );
}
