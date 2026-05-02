import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PublicLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-1">
            <span className="text-orange-500 font-black text-xl tracking-widest uppercase">
              TR
            </span>
            <span className="text-white font-bold text-xl tracking-wider uppercase">
              Market Skins
            </span>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              Vitrine
            </NavLink>
            {user && (
              <>
                <NavLink
                  to="/favoritos"
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-widest font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                    }`
                  }
                >
                  Favoritos
                </NavLink>
                <NavLink
                  to="/perfil"
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-widest font-medium transition-colors ${isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                    }`
                  }
                >
                  Perfil
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className="text-sm uppercase tracking-widest font-medium 
                           text-orange-500 hover:text-orange-400 transition-colors"
              >
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-zinc-500 text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm uppercase tracking-widest text-zinc-400 
                 hover:text-orange-500 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm uppercase tracking-widest text-zinc-400
                 hover:text-white transition-colors font-medium"
                >
                  Cadastrar
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm uppercase tracking-widest bg-orange-500 
                 hover:bg-orange-600 text-black font-bold px-4 py-2 
                 rounded-lg transition-colors"
                >
                  Entrar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-zinc-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-zinc-600 text-sm uppercase tracking-widest">
            © 2026 TR Market Skins · Vendas via WhatsApp
          </p>
        </div>
      </footer>
    </div>
  )
}