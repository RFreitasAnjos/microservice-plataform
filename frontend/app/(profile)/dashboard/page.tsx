export default function DashboardPage() {
  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white px-6">

      <div className="max-w-lg text-center">
        {/* ERROR CODE */}
        <h1 className="text-8xl font-bold text-indigo-500">Dashboard</h1>
        {/* TITLE */}
        <h2 className="mt-4 text-2xl font-semibold">
          Bem-vindo ao seu dashboard
        </h2>
        {/* DESCRIPTION */}
        <p className="mt-3 text-gray-400">
          Aqui você pode gerenciar suas informações, visualizar estatísticas e acessar recursos exclusivos.
        </p>
      </div>
    </div>
    </>
  );
}