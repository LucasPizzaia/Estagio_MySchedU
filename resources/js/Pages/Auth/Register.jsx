import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Cadastrar" />
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* ESQUERDA — branca */}
        <div className="hidden lg:flex bg-white items-center justify-center relative p-8">
          <Link href="/dashboard" className="text-5xl md:text-6xl font-extrabold text-amber-600 hover:opacity-80 transition-opacity">
            MySchedU
          </Link>
          <div className="absolute bottom-4 left-6 text-sm tracking-wider text-gray-400 uppercase">
            unifil
          </div>
        </div>

        {/* DIREITA — laranja (form) */}
        <div className="bg-amber-600 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="mb-6 text-2xl font-semibold text-white">Criar conta</h1>

            <form onSubmit={submit} className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/90">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="mt-1 w-full rounded-md border border-transparent bg-white px-3 py-2 text-gray-800 placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="Seu nome"
                  autoComplete="name"
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-white">{errors.name}</p>}
              </div>

              {/* E-mail */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90">E-mail</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-white/90">Senha</label>
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="mt-1 w-full rounded-md border border-transparent bg-white px-3 py-2 text-gray-800 focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-white">{errors.password}</p>}
              </div>

              {/* Confirmar senha */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-white/90">Confirmar senha</label>
                <input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="mt-1 w-full rounded-md border border-transparent bg-white px-3 py-2 text-gray-800 focus:border-white focus:ring-2 focus:ring-white"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={processing}
                className="mt-2 w-full rounded-md bg-white px-4 py-2 font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
              >
                Cadastrar
              </button>

              {/* Já tem conta? */}
              <div className="text-center text-sm text-white/90">
                Já tem conta?{' '}
                <Link href="/login" className="font-semibold text-white underline">
                  Entrar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
