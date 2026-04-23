import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSkins from './pages/admin/AdminSkins'
import AdminSkinForm from './pages/admin/AdminSkinForm'
import PublicLayout from './layouts/PublicLayout.tsx'
import CatalogPage from './pages/public/CatalogPage.tsx'
import SkinDetailPage from './pages/public/SkinDetailPage.tsx'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, isAdmin } = useAuth()
  if (!token) return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/login" />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="skins/:id" element={<SkinDetailPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="skins" element={<AdminSkins />} />
        <Route path="skins/nova" element={<AdminSkinForm />} />
        <Route path="skins/editar/:id" element={<AdminSkinForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}