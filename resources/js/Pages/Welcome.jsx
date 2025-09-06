import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage().props; // pega o usuário autenticado (se existir)
  const destino = auth?.user ? '/professores' : '/login';

  return (
    <>
      <Head title="MySchedU" />
      <Link href={destino} className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-5xl md:text-6xl font-extrabold text-amber-600 hover:opacity-80 transition-opacity">
          MySchedU
        </span>
      </Link>
    </>
  );
}
