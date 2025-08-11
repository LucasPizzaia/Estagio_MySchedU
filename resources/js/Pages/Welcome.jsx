import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
  return (
    <>
      <Head title="MySchedU" />
      <Link href="/dashboard" className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-5xl md:text-6xl font-extrabold text-amber-600 hover:opacity-80 transition-opacity">
          MySchedU
        </span>
      </Link>
    </>
  );
}
