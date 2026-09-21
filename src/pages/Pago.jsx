import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'
import './Pedido.css'
import './Pago.css'
import { useCart } from '../context/CartContext'

function Sidebar() {
  const navigate = useNavigate()
  return (
    <div className="pd-sidebar">
      <div className="pd-brand"><span className="pd-brand-icon">☕</span><span className="pd-brand-label">Cafetería</span></div>
      <nav className="pd-nav">
        <div className="pd-nav-item" onClick={() => navigate('/home')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="pd-nav-label">Inicio</span>
        </div>
        <div className="pd-nav-item" onClick={() => navigate('/menu')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <span className="pd-nav-label">Menú</span>
        </div>
        <div className="pd-nav-item" onClick={() => navigate('/pedido')}>
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <span className="pd-nav-label">Pedidos</span>
        </div>
        <div className="pd-nav-item active">
          <svg className="pd-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span className="pd-nav-label">Pagos</span>
        </div>
        <div className="pd-nav-item">
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

function Pago() {
  const navigate = useNavigate()
  const location = useLocation()
  const { carrito, totalPrecio, vaciar, setUltimoPedido } = useCart()
  const nota = location.state?.nota || ''

  const [metodo, setMetodo] = useState('efectivo')
  const [procesando, setProcesando] = useState(false)
  const [errorPago, setErrorPago] = useState('')
  const [efectivoConque, setEfectivoConque] = useState('')

  const total = totalPrecio

  const cambioEfectivo = efectivoConque
    ? Math.max(0, parseFloat(efectivoConque) - total).toFixed(2)
    : null

  const confirmar = async () => {
    if (carrito.length === 0) return
    if (metodo === 'efectivo' && efectivoConque && parseFloat(efectivoConque) < total) return
    setProcesando(true)
    setErrorPago('')
    try {
      const res = await api.post('/pedidos', {
        productos: carrito.map(it => ({ id_producto: it.id_producto, cantidad: it.qty })),
        nota,
        metodo_pago: metodo,
      })
      setUltimoPedido({ folio: res.data.folio, total: res.data.total, id_pedido: res.data.id_pedido, metodo })
      vaciar()
      navigate('/pago-exitoso')
    } catch (err) {
      setErrorPago(err.response?.data?.mensaje || 'Error al procesar el pago. Intenta de nuevo.')
      setProcesando(false)
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="pd-layout">
        <Sidebar />
        <div className="pd-main">
          <div className="pd-header">
            <div>
              <div className="pd-title">Confirmar pago</div>
              <div className="pd-sub">No hay nada que pagar</div>
            </div>
            <button className="pd-seguir-btn" onClick={() => navigate('/menu')}>
              Ir al menú
            </button>
          </div>
          <div className="pd-empty" style={{ marginTop: '30px' }}>
            <div className="pd-empty-icon">🧾</div>
            <div className="pd-empty-t">Tu carrito está vacío</div>
            <div className="pd-empty-s">Agrega productos antes de pagar</div>
            <button className="pd-menu-btn" onClick={() => navigate('/menu')}>Ir al menú</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pd-layout">
      <Sidebar />
      <div className="pd-main">

        <div className="pd-header">
          <div>
            <div className="pd-title">Confirmar pago</div>
            <div className="pd-sub">Elige cómo quieres pagar tu pedido</div>
          </div>
          <button className="pd-seguir-btn" onClick={() => navigate('/pedido')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Volver al pedido
          </button>
        </div>

        <div className="pd-two-col">

          {/* IZQUIERDA — MÉTODO DE PAGO */}
          <div className="pd-left">
            <div className="pd-card">
              <div className="pd-card-header">
                <span className="pd-card-title">Método de pago</span>
              </div>

              {/* Opciones */}
              <div className="pg-metodos">
                <div
                  className={`pg-metodo ${metodo === 'efectivo' ? 'selected' : ''}`}
                  onClick={() => setMetodo('efectivo')}
                >
                  <div className="pg-metodo-icon">💵</div>
                  <div className="pg-metodo-info">
                    <div className="pg-metodo-nombre">Efectivo</div>
                    <div className="pg-metodo-desc">Paga al recoger tu pedido</div>
                  </div>
                  <div className={`pg-radio ${metodo === 'efectivo' ? 'active' : ''}`}></div>
                </div>

                <div
                  className={`pg-metodo ${metodo === 'tarjeta' ? 'selected' : ''}`}
                  onClick={() => setMetodo('tarjeta')}
                >
                  <div className="pg-metodo-icon">💳</div>
                  <div className="pg-metodo-info">
                    <div className="pg-metodo-nombre">Tarjeta de débito / crédito</div>
                    <div className="pg-metodo-desc">Terminal disponible en caja</div>
                  </div>
                  <div className={`pg-radio ${metodo === 'tarjeta' ? 'active' : ''}`}></div>
                </div>

                <div
                  className={`pg-metodo ${metodo === 'qr' ? 'selected' : ''}`}
                  onClick={() => setMetodo('qr')}
                >
                  <div className="pg-metodo-icon">📱</div>
                  <div className="pg-metodo-info">
                    <div className="pg-metodo-nombre">Código QR / CoDi</div>
                    <div className="pg-metodo-desc">Paga con tu app bancaria</div>
                  </div>
                  <div className={`pg-radio ${metodo === 'qr' ? 'active' : ''}`}></div>
                </div>
              </div>

              {/* Detalle efectivo */}
              {metodo === 'efectivo' && (
                <div className="pg-detalle">
                  <div className="pg-detalle-label">¿Con cuánto pagas? (opcional)</div>
                  <div className="pg-input-wrap">
                    <span className="pg-peso">$</span>
                    <input
                      className="pg-input"
                      type="number"
                      min={total}
                      placeholder={`${total.toFixed(2)}`}
                      value={efectivoConque}
                      onChange={e => setEfectivoConque(e.target.value)}
                    />
                  </div>
                  {efectivoConque && parseFloat(efectivoConque) < total && (
                    <div className="pg-error">El monto es menor al total a pagar</div>
                  )}
                  {cambioEfectivo && parseFloat(efectivoConque) >= total && (
                    <div className="pg-cambio">
                      <span>Tu cambio será:</span>
                      <span className="pg-cambio-val">${cambioEfectivo}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Detalle tarjeta */}
              {metodo === 'tarjeta' && (
                <div className="pg-detalle pg-info-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Dirígete a caja con tu número de pedido. La terminal estará lista para procesarlo.
                </div>
              )}

              {/* Detalle QR */}
              {metodo === 'qr' && (
                <div className="pg-detalle pg-info-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Al confirmar, se generará un QR que podrás escanear con tu app de banco o de pagos.
                </div>
              )}
            </div>
          </div>

          {/* DERECHA — RESUMEN */}
          <div className="pd-right">
            <div className="pd-ticket-toggle">
              <div className="pd-toggle-left">
                <span className="pd-toggle-icon">🧾</span>
                <span className="pd-toggle-label">Resumen del pedido</span>
              </div>
              <span className="pd-toggle-total">${total.toFixed(2)}</span>
            </div>

            <div className="pd-ticket-paper">
              <div className="pd-ticket-inner">
                <div className="pd-t-brand">CAFETERÍA 2 ITLC</div>
                <div className="pd-t-info">
                  <div className="pd-t-info-row">Productos: <span>{carrito.reduce((a, b) => a + b.qty, 0)}</span></div>
                  <div className="pd-t-info-row">Método: <span>{metodo.charAt(0).toUpperCase() + metodo.slice(1)}</span></div>
                  {nota && <div className="pd-t-info-row">Nota: <span>{nota}</span></div>}
                </div>
                <hr className="pd-t-dash"/>
                {carrito.map(it => (
                  <div key={it.id_producto} className="pd-t-row">
                    <span className="pd-t-rname">{it.n} ×{it.qty}</span>
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

            {errorPago && (
              <div className="pg-error" style={{ marginBottom: '10px', textAlign: 'center' }}>{errorPago}</div>
            )}

            <button
              className="pd-pagar-btn"
              disabled={procesando || (metodo === 'efectivo' && efectivoConque && parseFloat(efectivoConque) < total)}
              onClick={confirmar}
            >
              {procesando ? 'PROCESANDO...' : 'CONFIRMAR PEDIDO'}
            </button>
            <div className="pd-secure">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Tu pedido se registra al confirmar
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Pago
