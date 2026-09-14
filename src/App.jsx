import { BrowserRouter, Routes, Route } from 'react-router-dom'
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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
        <Route path="/pedido-listo" element={<PedidoListo />} />
        <Route path="/recuperar-cuenta" element={<RecuperarCuenta />} />
        <Route path="/verificar-codigo" element={<VerificarCodigo />} />
        <Route path="/restablecer-password" element={<RestablecerPassword />} />
        <Route path="/password-actualizada" element={<PasswordActualizada />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App