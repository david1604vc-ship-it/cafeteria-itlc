import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Pedido from './pages/Pedido'
import Pago from './pages/Pago'
import PagoExitoso from './pages/PagoExitoso'
import PedidoListo from './pages/PedidoListo'
import RecuperarCuenta from './pages/RecuperarCuenta'
import VerificarCodigo from './pages/VerificarCodigo'
import RestablecerPassword from './pages/RestablecerPassword'
import PasswordActualizada from './pages/PasswordActualizada'
import Admin from './pages/Admin'

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return children
}

function RequireAdmin({ children }) {
  const token = localStorage.getItem('token')
  let esAdmin = false
  try {
    const u = JSON.parse(localStorage.getItem('usuario') || 'null')
    esAdmin = u?.rol === 'administrador'
  } catch { /* token corrupto */ }
  if (!token || !esAdmin) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/restablecer-password" element={<RestablecerPassword />} />
        <Route path="/password-actualizada" element={<PasswordActualizada />} />

        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/menu" element={<RequireAuth><Menu /></RequireAuth>} />
        <Route path="/pedido" element={<RequireAuth><Pedido /></RequireAuth>} />
        <Route path="/pago" element={<RequireAuth><Pago /></RequireAuth>} />
        <Route path="/pago-exitoso" element={<RequireAuth><PagoExitoso /></RequireAuth>} />
        <Route path="/pedido-listo" element={<RequireAuth><PedidoListo /></RequireAuth>} />

        <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
