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
        
        {/* Lado ESQUERDO - Branco com Logos Estruturadas */}
        <div className="hidden lg:flex bg-white flex-col items-center justify-center relative p-8">
          
          {/* LOGO DO NPI NO CANTO SUPERIOR */}
          <div className="absolute top-12">
            <img 
              src="/images/logo_npi.png" 
              alt="Logo NPI" 
              className="h-28 w-auto transition-transform hover:scale-105 duration-300" 
            />
          </div>

          {/* MYSCHEDU NO CENTRO */}
          <div className="text-center">
            <Link
              href="/professores"
              className="text-5xl md:text-6xl font-black text-amber-600 hover:opacity-80 transition-opacity tracking-tighter"
            >
              MySchedU
            </Link>
            
          </div>

          {/* LOGO DA UNIFIL NO CANTO INFERIOR */}
          <div className="absolute bottom-12">
             <img 
                src="/images/logo_unifil.png" 
                alt="UniFil" 
                className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity" 
             />
          </div>
        </div>

        {/* Lado DIREITO - Laranja com o form */}
        <div className="bg-amber-600 flex items-center justify-center p-8 text-white">
          <div className="w-full max-w-md">
            
            {/* Logo para Mobile */}
            <div className="lg:hidden flex flex-col items-center mb-8 text-center">
                <img src="/images/logo_npi.png" alt="NPI" className="h-20 w-auto mb-4" />
                <h1 className="text-3xl font-black tracking-tighter">MySchedU</h1>
            </div>

            {status && (
              <div className="mb-4 rounded bg-white/20 px-4 py-2 text-white">
                {status}
              </div>
            )}

            <h1 className="mb-6 text-2xl font-black uppercase tracking-widest">Entrar</h1>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-white/90 mb-1">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full rounded-xl border-none bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-amber-500/20 transition-all shadow-lg"
                  placeholder="seu@email.com"
                  required
                />
                {errors.email && <p className="mt-1 text-xs font-bold bg-red-500/20 p-2 rounded-lg">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-white/90 mb-1">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full rounded-xl border-none bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-amber-500/20 transition-all shadow-lg"
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="mt-1 text-xs font-bold bg-red-500/20 p-2 rounded-lg">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="inline-flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-tighter cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 rounded border-transparent text-amber-800 focus:ring-white"
                  />
                  Lembrar-me
                </label>

                {canResetPassword && (
                  <Link href="/forgot-password" title="Esqueci a senha" className="text-xs font-bold hover:underline uppercase tracking-tighter">
                    Esqueci a senha
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full rounded-xl bg-white px-4 py-4 font-black text-amber-700 hover:bg-amber-50 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-60 uppercase text-xs tracking-[0.2em]"
              >
                {processing ? 'Entrando...' : 'Entrar'}
              </button>
              
              <div className="text-center pt-4 text-xs font-bold text-white/80 uppercase tracking-widest">
                Não tem conta?{' '}
                <Link href="/register" className="text-white underline font-black">
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