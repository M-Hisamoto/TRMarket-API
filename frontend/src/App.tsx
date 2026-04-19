import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import AdminDashboard from './pages/admin/AdminDashboard.tsx'
import AdminSkins from './pages/admin/AdminSkins.tsx'
import AdminSkinForm from './pages/admin/AdminSkinForm.tsx'

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
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}