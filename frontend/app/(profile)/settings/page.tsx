export default function SettingsPage() {
  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white px-6">

      <div className="max-w-lg text-center">
        {/* ERROR CODE */}
        <h1 className="text-8xl font-bold text-indigo-500">Settings</h1>
        {/* TITLE */}
        <h2 className="mt-4 text-2xl font-semibold">
          Gerencie suas configurações
        </h2>
        {/* DESCRIPTION */}
        <p className="mt-3 text-gray-400">
          Aqui você pode ajustar suas preferências, configurar notificações e personalizar sua experiência.
        </p>
      </div>
    </div>
    </>
  );
}