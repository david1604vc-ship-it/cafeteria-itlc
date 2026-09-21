import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Home.css'
import { useScrollSidebar } from '../hooks/useScrollSidebar'

function Home() {
  useScrollSidebar()
  const navigate = useNavigate()
  const [promos, setPromos] = useState([])
  const [destacados, setDestacados] = useState([])

  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        const [pr, prods] = await Promise.all([
          api.get('/menu/promociones').catch(() => ({ data: [] })),
          api.get('/menu/productos'),
        ])
        if (!vivo) return
        setPromos(pr.data)
        // Destacados: 4 productos de comida para la sección "populares"
        setDestacados(prods.data.filter(p => p.id_categoria === 1).slice(0, 4))
      } catch {
        // silencioso: el home funciona sin promos
      }
    })()
    return () => { vivo = false }
  }, [])

  return (
    <div className="layout">
      <div className="sidebar" id="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">☕</span>
          <span className="brand-label">Cafetería</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active" data-label="Inicio" onClick={() => navigate('/home')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="nav-label">Inicio</span>
          </div>
          <div className="nav-item" data-label="Menú" onClick={() => navigate('/menu')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <line x1="9" y1="12" x2="15" y2="12"/>
              <line x1="9" y1="16" x2="13" y2="16"/>
            </svg>
            <span className="nav-label">Menú</span>
          </div>
          <div className="nav-item" data-label="Pedidos" onClick={() => navigate('/pedido')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="nav-label">Pedidos</span>
          </div>
          <div className="nav-item" data-label="Pagos" onClick={() => navigate('/pago')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="nav-label">Pagos</span>
          </div>
          <div className="nav-item" data-label="Cuenta">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="nav-label">Cuenta</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="logout-btn" onClick={() => navigate('/')}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="logout-label">Cerrar sesión</span>
          </div>
        </div>
      </div>

      <div className="main" id="main">
        <div className="hero">
          <div className="dots-deco">
            {Array(15).fill(0).map((_, i) => <div key={i} className="d"></div>)}
          </div>
          <div className="hero-text">
            <div className="hero-title">Tu comida favorita<br/><span>en segundos</span></div>
            <p className="hero-desc">Explora el menú de la cafetería<br/>y realiza tu pedido fácilmente.</p>
            <p className="hero-desc2">Realiza tu pedido y paga tu comida<br/>de la cafetería de forma rápida.</p>
            <button className="hero-btn" onClick={() => navigate('/menu')}>Ver menú</button>
          </div>
          <div className="hero-img">☕</div>
        </div>

        <div className="section-title">Promociones</div>
        <div className="promos-grid">
          {promos.length === 0 ? (
            <>
              <div className="promo-card">
                <div className="promo-info">
                  <div className="promo-badge badge-combo">Combo del día</div>
                  <div className="promo-name">Sándwich + Bebida</div>
                  <p className="promo-desc">Disfruta nuestro combo especial del día.</p>
                  <div className="promo-price">$85.00</div>
                </div>
                <div className="promo-img">🥪</div>
              </div>
              <div className="promo-card">
                <div className="promo-info">
                  <div className="promo-badge badge-desc">Descuento</div>
                  <div className="promo-name">Descuento en café</div>
                  <p className="promo-desc">Todos los miércoles 20% de descuento en cafés seleccionados.</p>
                  <div className="promo-price promo-off">20% OFF</div>
                </div>
                <div className="promo-img">☕</div>
              </div>
            </>
          ) : promos.map(pr => (
            <div key={pr.id_promocion} className="promo-card">
              <div className="promo-info">
                <div className={`promo-badge ${pr.descuento && pr.descuento.includes('%') ? 'badge-desc' : 'badge-combo'}`}>
                  {pr.descuento || 'Promo'}
                </div>
                <div className="promo-name">{pr.titulo}</div>
                <p className="promo-desc">{pr.descripcion}</p>
                {pr.producto_nombre && (
                  <div className="promo-price">{pr.producto_nombre}</div>
                )}
              </div>
              <div className="promo-img">🏷️</div>
            </div>
          ))}
        </div>

        {destacados.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: '34px' }}>Los más pedidos</div>
            <div className="promos-grid">
              {destacados.map(p => (
                <div key={p.id_producto} className="promo-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/menu')}>
                  <div className="promo-info">
                    <div className="promo-badge badge-combo">{p.unidad || 'Disponible'}</div>
                    <div className="promo-name">{p.nombre}</div>
                    <p className="promo-desc">{p.descripcion}</p>
                    <div className="promo-price">${Number(p.precio).toFixed(2)}</div>
                  </div>
                  <div className="promo-img">🍽️</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
