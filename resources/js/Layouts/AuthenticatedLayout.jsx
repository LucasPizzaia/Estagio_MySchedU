import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function AuthenticatedLayout({ header, children, bgClass = 'bg-amber-600' }) {
  const { auth } = usePage().props;
  const current = usePage().url || '/';
  const [open, setOpen] = useState(false);

  const isActive = (path) => current === path || current.startsWith(path + '/');

  // Ajuste de cores para Branco Total
  // text-white/70 para itens não selecionados (branco suave)
  // text-white font-bold para o selecionado
  const linkClasses = "text-white/70 hover:text-white transition-all duration-200 font-medium border-b-2 border-transparent py-2 flex items-center uppercase text-xs tracking-widest";
  const activeClasses = "text-white font-black border-white py-2 flex items-center uppercase text-xs tracking-widest";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <nav className="bg-amber-600 border-b border-amber-700 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-10">
              <Link href="/professores" className="text-2xl font-black text-white tracking-tighter">MySchedU</Link>

              {/* MENU DESKTOP TOTALMENTE BRANCO */}
              <div className="hidden sm:-my-px sm:flex sm:items-center sm:gap-8 h-16">
                <Link 
                  href="/professores" 
                  className={isActive('/professores') ? activeClasses : linkClasses}
                >
                  PROFESSORES
                </Link>

                <Link 
                  href="/turmas" 
                  className={isActive('/turmas') ? activeClasses : linkClasses}
                >
                  TURMAS
                </Link>

                <Link 
                  href="/unidades-curriculares" 
                  className={isActive('/unidades-curriculares') ? activeClasses : linkClasses}
                >
                  UNIDADES CURRICULARES
                </Link>

                <Link 
                  href={route('ensalamento.index')} 
                  className={route().current('ensalamento.*') ? activeClasses : linkClasses}
                >
                  ENSALAMENTO
                </Link>
                
                <Link 
                  href="/salas" 
                  className={isActive('/salas') ? activeClasses : linkClasses}
                >
                  SALAS
                </Link>
              </div>
            </div>

            {/* Usuário e Sair em Branco */}
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm font-bold text-white uppercase tracking-tight">
                    {auth.user?.name}
                </span>
                <Link 
                  href="/logout" 
                  method="post" 
                  as="button" 
                  className="text-[10px] font-bold text-white border border-white/40 px-3 py-1 rounded-full hover:bg-white hover:text-amber-600 transition-all uppercase"
                >
                  Sair
                </Link>
              </div>
              
              {/* Botão Mobile (Hambúrguer) em Branco */}
              <button onClick={() => setOpen(!open)} className="sm:hidden text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Adicionei uma leve transparência branca no fundo para destacar as tabelas */}
        <div className="bg-white/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 border border-white/20">
            {children}
        </div>
      </main>
    </div>
  );
}