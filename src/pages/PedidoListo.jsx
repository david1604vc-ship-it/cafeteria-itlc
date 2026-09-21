import { useNavigate } from 'react-router-dom'
import './Pago.css'
import { useCart } from '../context/CartContext'

function PedidoListo() {
  const navigate = useNavigate()
  const { ultimoPedido } = useCart()

  return (
    <div className="px-wrap">
      <div className="px-card">
        <div className="px-icon">📋</div>
        <div className="px-title">Pedido registrado</div>
        <p className="px-desc">
          La cafetería ya recibió tu pedido. Te avisaremos cuando esté listo.
        </p>
        {ultimoPedido && (
          <div className="px-folio-card">
            <div className="px-folio-lbl">Tu folio</div>
            <div className="px-folio">{ultimoPedido.folio}</div>
            <div className="px-total">Total: ${Number(ultimoPedido.total).toFixed(2)}</div>
          </div>
        )}
        <div className="px-actions">
          <button className="px-btn px-primary" onClick={() => navigate('/menu')}>Ver menú</button>
          <button className="px-btn px-secondary" onClick={() => navigate('/home')}>Ir al inicio</button>
        </div>
      </div>
    </div>
  )
}

export default PedidoListo
