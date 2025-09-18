import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Entrar" />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Lado ESQUERDO - branco */}
        <div className="hidden lg:flex bg-white items-center justify-center relative p-8">
          {/* >>> alterado para /professores */}
          <Link
            href="/professores"
            className="text-5xl md:text-6xl font-extrabold text-amber-600 hover:opacity-80 transition-opacity"
          >
            MySchedU
          </Link>
          <div className="absolute bottom-4 left-6 text-sm tracking-wider text-gray-400 uppercase">
            unifil
          </div>
        </div>

        {/* Lado DIREITO - laranja com o form */}
        <div className="bg-amber-600 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Status (ex: link de verificação enviado) */}
            {status && (
              <div className="mb-4 rounded bg-white/20 px-4 py-2 text-white">
                {status}
              </div>
            )}

            <h1 className="mb-6 text-2xl font-semibold text-white">Entrar</h1>

            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="mt-1 w-full rounded-md border border-transparent bg-white px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="seu@email.com"
                  autoComplete="username"
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-white">{errors.email}</p>}
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1 w-full rounded-md border border-transparent bg-white px-3 py-2 text-gray-800 focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-white">{errors.password}</p>}
              </div>

              {/* Lembrar-me + Esqueci senha */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-white/90 text-sm">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 rounded border-white/40 text-amber-700 focus:ring-white"
                  />
                  Lembrar-me
                </label>

                {canResetPassword && (
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-white hover:underline"
                  >
                    Esqueci a senha
                  </Link>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="mt-2 w-full rounded-md bg-white px-4 py-2 font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
              >
                Entrar
              </button>
              
              {/* Registrar (opcional) */}
              <div className="text-center text-sm text-white/90">
                Não tem conta?{' '}
                <Link href="/register" className="font-semibold text-white underline">
                  Cadastrar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
