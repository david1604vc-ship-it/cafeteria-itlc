import { useNavigate } from 'react-router-dom'
import './Pago.css'
import { useCart } from '../context/CartContext'

function PagoExitoso() {
  const navigate = useNavigate()
  const { ultimoPedido } = useCart()

  return (
    <div className="px-wrap">
      <div className="px-card">
        <div className="px-icon">✅</div>
        <div className="px-title">¡Pago exitoso!</div>
        <p className="px-desc">
          Tu pedido quedó registrado. Preséntate en caja con tu folio para recogerlo.
        </p>
        {ultimoPedido && (
          <div className="px-folio-card">
            <div className="px-folio-lbl">Tu folio</div>
            <div className="px-folio">{ultimoPedido.folio}</div>
            <div className="px-total">Total: ${Number(ultimoPedido.total).toFixed(2)}</div>
          </div>
        )}
        <div className="px-actions">
          <button className="px-btn px-primary" onClick={() => navigate('/menu')}>Pedir algo más</button>
          <button className="px-btn px-secondary" onClick={() => navigate('/home')}>Ir al inicio</button>
        </div>
      </div>
    </div>
  )
}

export default PagoExitoso
