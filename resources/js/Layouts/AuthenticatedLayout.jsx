import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function AuthenticatedLayout({ header, children, bgClass = 'bg-gray-100' }) {
  const { auth } = usePage().props;
  const current = usePage().url || '/';
  const [open, setOpen] = useState(false);

  const isActive = (path) => current === path || current.startsWith(path + '/');

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <nav className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/professores" className="text-xl font-bold text-amber-600">MySchedU</Link>

              <div className="hidden sm:-my-px sm:ms-10 sm:flex sm:items-center sm:gap-6">
                <NavLink href="/professores"           active={isActive('/professores')}>PROFESSORES</NavLink>
                <NavLink href="/turmas"                active={isActive('/turmas')}>TURMAS</NavLink>
                <NavLink href="/unidades-curriculares" active={isActive('/unidades-curriculares')}>UNIDADES CURRICULARES</NavLink>
              </div>
            </div>

            {/* Usuário + Toggler */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-gray-600">{auth.user?.name}</span>
              <Link href="/logout" method="post" as="button" className="hidden sm:inline text-sm text-gray-600 hover:text-red-600">
                Sair
              </Link>

              <button
                onClick={() => setOpen(!open)}
                className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <svg className={`${open ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg className={`${open ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${open ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {/* removido /dashboard */}
            <ResponsiveNavLink href="/professores"           active={isActive('/professores')}>Professores</ResponsiveNavLink>
            <ResponsiveNavLink href="/turmas"                active={isActive('/turmas')}>Turmas</ResponsiveNavLink>
            <ResponsiveNavLink href="/unidades-curriculares" active={isActive('/unidades-curriculares')}>Unidades Curriculares</ResponsiveNavLink>
          </div>

          <div className="border-t border-gray-200 pt-4 pb-1">
            <div className="px-4">
              <div className="text-base font-medium text-gray-800">{auth.user?.name}</div>
              <div className="text-sm font-medium text-gray-500">{auth.user?.email}</div>
            </div>
            <div className="mt-3 space-y-1">
              <ResponsiveNavLink as="button" method="post" href="/logout">Sair</ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      <main className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
