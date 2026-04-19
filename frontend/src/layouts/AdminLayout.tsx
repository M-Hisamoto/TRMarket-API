import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-orange-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-orange-500 font-black text-xl tracking-widest uppercase">
              TR
            </span>
            <span className="text-white font-bold text-xl tracking-wider uppercase">
              Market Skins
            </span>
            <span className="ml-3 text-xs bg-orange-500/20 text-orange-400 
                            border border-orange-500/30 px-2 py-0.5 rounded uppercase tracking-widest">
              Admin
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/skins"
              className={({ isActive }) =>
                `text-sm uppercase tracking-widest font-medium transition-colors ${
                  isActive ? 'text-orange-500' : 'text-zinc-400 hover:text-white'
                }`
              }
            >
              Skins
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm uppercase tracking-widest text-zinc-400 
                         hover:text-orange-500 transition-colors font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}