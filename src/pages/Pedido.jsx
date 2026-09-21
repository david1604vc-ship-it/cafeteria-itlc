import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Pedido.css'
import { useCart } from '../context/CartContext'

function Sidebar() {
  const navigate = useNavigate()
  return (
    <div className="pd-sidebar">
      <div className="pd-brand"><span className="pd-brand-icon">☕</span><span className="pd-brand-label">Cafetería</span></div>
      <nav className="pd-nav">
        <div className="pd-nav-item" data-label="Inicio" onClick={() => navigate('/home')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="pd-nav-label">Inicio</span>
        </div>
        <div className="pd-nav-item" data-label="Menú" onClick={() => navigate('/menu')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <span className="pd-nav-label">Menú</span>
        </div>
        <div className="pd-nav-item active" data-label="Pedidos">
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <span className="pd-nav-label">Pedidos</span>
        </div>
        <div className="pd-nav-item" data-label="Pagos" onClick={() => navigate('/pago')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span className="pd-nav-label">Pagos</span>
        </div>
        <div className="pd-nav-item" data-label="Cuenta">
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="pd-nav-label">Cuenta</span>
        </div>
      </nav>
      <div className="pd-footer">
        <div className="pd-logout" onClick={() => navigate('/')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="pd-logout-label">Salir</span>
        </div>
      </div>
    </div>
  )
}

function Pedido() {
  const navigate = useNavigate()
  const { carrito, cambiarCantidad, eliminarItem, vaciar } = useCart()
  const [ticketOpen, setTicketOpen] = useState(true)
  const [nota, setNota] = useState('')

  const total = carrito.reduce((a, b) => a + b.p * b.qty, 0)

  const now = new Date()
  const fecha = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const hora = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  // Folio provisional (el real lo genera el backend al confirmar)
  const [folio] = useState(() => '#' + String(Math.floor(1000 + Math.random() * 9000)))

  const continuarPago = () => {
    navigate('/pago', { state: { nota } })
  }

  return (
    <div className="pd-layout">
      <Sidebar />
      <div className="pd-main">

        <div className="pd-header">
          <div>
            <div className="pd-title">Mi pedido</div>
            <div className="pd-sub">Revisa y confirma los productos</div>
          </div>
          <button className="pd-seguir-btn" onClick={() => navigate('/menu')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Seguir comprando
          </button>
        </div>

        <div className="pd-two-col">

          {/* IZQUIERDA — PRODUCTOS */}
          <div className="pd-left">
            <div className="pd-card">
              <div className="pd-card-header">
                <span className="pd-card-title">Productos seleccionados</span>
                {carrito.length > 0 && (
                  <span className="pd-vaciar" onClick={vaciar}>Vaciar todo</span>
                )}
              </div>

              {carrito.length === 0 ? (
                <div className="pd-empty">
                  <div className="pd-empty-icon">🛒</div>
                  <div className="pd-empty-t">Tu pedido está vacío</div>
                  <div className="pd-empty-s">Agrega productos desde el menú</div>
                  <button className="pd-menu-btn" onClick={() => navigate('/menu')}>Ir al menú</button>
                </div>
              ) : (
                carrito.map(it => (
                  <div key={it.id_producto} className="pd-prod-item">
                    <div className="pd-prod-img">{it.i}</div>
                    <div className="pd-prod-info">
                      <div className="pd-prod-name">{it.n}</div>
                      <div className="pd-prod-unit">{it.u}</div>
                    </div>
                    <div className="pd-qty-wrap">
                      <button className="pd-qb pd-minus" onClick={() => cambiarCantidad(it.id_producto, -1)}>−</button>
                      <span className="pd-qn">{it.qty}</span>
                      <button className="pd-qb" onClick={() => cambiarCantidad(it.id_producto, 1)}>+</button>
                    </div>
                    <span className="pd-prod-price">${(it.p * it.qty).toFixed(2)}</span>
                    <button className="pd-del" onClick={() => eliminarItem(it.id_producto)}>✕</button>
                  </div>
                ))
              )}

              <div className="pd-nota-wrap">
                <div className="pd-nota-lbl">Nota para cocina (opcional)</div>
                <textarea
                  className="pd-nota-input"
                  rows="2"
                  placeholder="Ej: Sin cebolla, extra salsa..."
                  value={nota}
                  onChange={e => setNota(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* DERECHA — TICKET */}
          <div className="pd-right">
            <div className="pd-ticket-toggle" onClick={() => setTicketOpen(!ticketOpen)}>
              <div className="pd-toggle-left">
                <span className="pd-toggle-icon">🧾</span>
                <span className="pd-toggle-label">Ver resumen</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="pd-toggle-total">${total.toFixed(2)}</span>
                <svg
                  className={`pd-toggle-arrow ${ticketOpen ? 'open' : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </div>
            </div>

            <div className={`pd-ticket-paper ${ticketOpen ? '' : 'collapsed'}`}>
              <div className="pd-ticket-inner">
                <div className="pd-t-brand">CAFETERÍA 2 ITLC</div>
                <div className="pd-t-info">
                  <div className="pd-t-info-row">Folio: <span>{folio}</span></div>
                  <div className="pd-t-info-row">Fecha: <span>{fecha}</span></div>
                  <div className="pd-t-info-row">Hora: <span>{hora}</span></div>
                </div>
                <hr className="pd-t-dash"/>
                <div className="pd-t-cols">
                  <span>Producto</span>
                  <span style={{ textAlign: 'center' }}>Cant.</span>
                  <span style={{ textAlign: 'right' }}>Precio</span>
                </div>
                {carrito.map(it => (
                  <div key={it.id_producto} className="pd-t-row">
                    <span className="pd-t-rname">{it.n}</span>
                    <span className="pd-t-rqty">{it.qty}</span>
                    <span className="pd-t-rprice">${(it.p * it.qty).toFixed(2)}</span>
                  </div>
                ))}
                <hr className="pd-t-dash"/>
                <div className="pd-t-total-row">
                  <span className="pd-t-total-lbl">Total:</span>
                  <span className="pd-t-total-val">${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="pd-ticket-bottom"></div>
            </div>

            <button
              className="pd-pagar-btn"
              disabled={carrito.length === 0}
              onClick={continuarPago}
            >
              PAGAR
            </button>
            <div className="pd-secure">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Tu pago es seguro y encriptado
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Pedido
