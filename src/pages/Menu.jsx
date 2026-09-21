import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import './Menu.css'
import { useScrollSidebar } from '../hooks/useScrollSidebar'
import { useCart } from '../context/CartContext'

// ── Constantes de presentación ────────────────────────────────────────────

// Emoji por subcategoría (fallback cuando el producto no tiene imagen)
const EMOJI_SUB = {
  sandwich: '🥪', torta: '🫓', antojitos: '🌮', combos: '🍱', otros: '🍽️',
  cafe: '☕', frappe: '🍫', jugo: '🍊', licuado: '🥛',
  pastel: '🍰', muffin: '🧁',
  refresco: '🥤', botana: '🍟', dulce: '🍬',
}

const EMOJI_DEFECTO = {
  Comida: '🍽️', Bebidas: '🥤', Postres: '🍰', Otros: '🛍️', Promociones: '🏷️',
}

const emojiDe = (prod) =>
  prod.imagen_url ||
  EMOJI_SUB[prod.subcategoria] ||
  EMOJI_DEFECTO[prod.categoria] ||
  prod.categoria_icono ||
  '🍽️'

const prettySub = (sub) => sub.charAt(0).toUpperCase() + sub.slice(1)

const RESENAS_INICIALES = {
  'Club Sándwich': [
    { u: 'Carlos M.', s: 5, t: 'Excelente sándwich, muy fresco.', f: '05/05/2026' },
    { u: 'Laura G.', s: 3, t: 'Bien pero le falta más jamón.', f: '04/05/2026' },
    { u: 'Pedro R.', s: 2, t: 'El pan estaba un poco duro.', f: '03/05/2026' },
  ],
  'Torta Cubana': [
    { u: 'Ana L.', s: 5, t: 'La mejor torta cubana que he probado.', f: '06/05/2026' },
    { u: 'Miguel A.', s: 5, t: 'Increíble, me encantó.', f: '05/05/2026' },
    { u: 'Sofia T.', s: 4, t: 'Muy buena, solo le faltó más salsa.', f: '04/05/2026' },
  ],
}

// ── Componentes puros ─────────────────────────────────────────────────────

function StarRow({ prod, rating, numResenas, onRate, onVerResenas }) {
  return (
    <div>
      <div className="mn-stars-row">
        {[1,2,3,4,5].map(v => (
          <span key={v} className="mn-star" onClick={() => onRate(prod.id_producto, v)}>
            {v <= rating ? '⭐' : '☆'}
          </span>
        ))}
        <span className="mn-rcount">{numResenas} reseñas</span>
      </div>
      <span className="mn-reviews-link" onClick={() => onVerResenas(prod)}>
        Ver reseñas ›
      </span>
    </div>
  )
}

function CardHoriz({ prod, fav, onToggleFav, onAdd, rating, numResenas, onRate, onVerResenas }) {
  return (
    <div className="mn-card-horiz">
      <div className="mn-card-img">{prod.i}</div>
      <div className="mn-card-body">
        <div className="mn-card-name">{prod.nombre}</div>
        <div className="mn-card-desc">{prod.descripcion}</div>
        <div className="mn-card-unit">{prod.unidad}</div>
        <StarRow prod={prod} rating={rating} numResenas={numResenas} onRate={onRate} onVerResenas={onVerResenas} />
        <div className="mn-card-footer">
          <span className="mn-card-price">${Number(prod.precio).toFixed(2)}</span>
          <div className="mn-card-actions">
            <button
              className={`mn-fav-btn ${fav ? 'active' : ''}`}
              onClick={() => onToggleFav(prod.id_producto)}
              title="Agregar a favoritos"
            >
              {fav ? '❤️' : '🤍'}
            </button>
            <button className="mn-add-btn" onClick={() => onAdd(prod)}>+</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  const navigate = useNavigate()
  return (
    <div className="mn-sidebar" id="sidebar">
      <div className="mn-brand">
        <span className="mn-brand-icon">☕</span>
        <span className="mn-brand-label">Cafetería</span>
      </div>
      <nav className="mn-nav">
        <div className="mn-nav-item" data-label="Inicio" onClick={() => navigate('/home')}>
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="mn-nav-label">Inicio</span>
        </div>
        <div className="mn-nav-item active" data-label="Menú">
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
          <span className="mn-nav-label">Menú</span>
        </div>
        <div className="mn-nav-item" data-label="Pedidos" onClick={() => navigate('/pedido')}>
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <span className="mn-nav-label">Pedidos</span>
        </div>
        <div className="mn-nav-item" data-label="Pagos" onClick={() => navigate('/pago')}>
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          <span className="mn-nav-label">Pagos</span>
        </div>
        <div className="mn-nav-item" data-label="Cuenta">
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="mn-nav-label">Cuenta</span>
        </div>
      </nav>
      <div className="mn-footer">
        <div className="mn-logout" onClick={() => navigate('/')}>
          <svg className="mn-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="mn-logout-label">Salir</span>
        </div>
      </div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────────────────

function Menu() {
  const navigate = useNavigate()
  const { agregarItem, totalItems, totalPrecio } = useCart()

  const [screen, setScreen] = useState('menu')
  const [secActiva, setSecActiva] = useState(null)
  const [chipActivo, setChipActivo] = useState('todos')
  const [tabActivo, setTabActivo] = useState('menu')
  const [busqueda, setBusqueda] = useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [ratings, setRatings] = useState({})
  const [favoritos, setFavoritos] = useState({})
  const [resenasScreen, setResenasScreen] = useState(false)
  const [prodActivo, setProdActivo] = useState(null)
  const [arStar, setArStar] = useState(0)
  const [arText, setArText] = useState('')
  const [filterStar, setFilterStar] = useState(0)
  const [resenas, setResenas] = useState(RESENAS_INICIALES)

  // Datos de la API
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState('')

  useScrollSidebar()

  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        const [cats, prods] = await Promise.all([
          api.get('/menu/categorias'),
          api.get('/menu/productos'),
        ])
        if (!vivo) return
        setCategorias(cats.data)
        setProductos(prods.data.map(p => ({ ...p, i: emojiDe(p) })))
      } catch {
        if (!vivo) return
        setErrorApi('No se pudo cargar el menú. Intenta recargar la página.')
      } finally {
        if (vivo) setCargando(false)
      }
    })()
    return () => { vivo = false }
  }, [])

  // Secciones derivadas de la BD: una por categoría con productos
  const secciones = useMemo(() => {
    return categorias
      .map(cat => ({
        id: cat.id_categoria,
        key: String(cat.id_categoria),
        nombre: cat.nombre,
        icono: cat.icono || EMOJI_DEFECTO[cat.nombre] || '🍽️',
        esPromo: cat.nombre === 'Promociones',
        prods: productos.filter(p => p.id_categoria === cat.id_categoria),
      }))
      .filter(s => s.prods.length > 0)
  }, [categorias, productos])

  const seccionesNormales = secciones.filter(s => !s.esPromo)
  const seccionPromos = secciones.find(s => s.esPromo)
  const secActual = secciones.find(s => s.key === secActiva)

  // Chips: subcategorías presentes en los productos de la sección
  const chipsActual = useMemo(() => {
    if (!secActual) return []
    const subs = [...new Set(secActual.prods.map(p => p.subcategoria).filter(Boolean))]
    return [
      { k: 'todos', l: 'Todos' },
      ...subs.map(s => ({ k: s, l: `${EMOJI_SUB[s] || '•'} ${prettySub(s)}` })),
    ]
  }, [secActual])

  const prodsFull = useMemo(() => {
    if (!secActual) return []
    return chipActivo === 'todos'
      ? secActual.prods
      : secActual.prods.filter(p => p.subcategoria === chipActivo)
  }, [secActual, chipActivo])

  const starsStr = (n) => '⭐'.repeat(n) + '☆'.repeat(5 - n)
  const getRating = (id) => ratings[id] ?? 3
  const getAvg = (nombre) => {
    const rs = resenas[nombre] || []
    if (rs.length === 0) return '0.0'
    return (rs.reduce((a, b) => a + b.s, 0) / rs.length).toFixed(1)
  }
  const numResenasDe = (prod) => (resenas[prod.nombre] || []).length

  const toggleFav = (id) => setFavoritos(prev => ({ ...prev, [id]: !prev[id] }))

  const openResenas = (prod) => {
    setProdActivo(prod)
    setFilterStar(0)
    setArStar(0)
    setArText('')
    setResenasScreen(true)
    window.scrollTo(0, 0)
  }

  const submitResena = () => {
    if (!arStar) { alert('Selecciona una calificación'); return }
    if (!arText.trim()) { alert('Escribe un comentario'); return }
    setResenas(prev => ({
      ...prev,
      [prodActivo.nombre]: [{ u: 'Tú', s: arStar, t: arText, f: 'Hoy' }, ...(prev[prodActivo.nombre] || [])]
    }))
    setArStar(0)
    setArText('')
  }

  const openFull = (key) => {
    setSecActiva(key)
    setChipActivo('todos')
    setScreen('full')
    setTabActivo(key)
  }

  const volverMenu = () => {
    setScreen('menu')
    setTabActivo('menu')
  }

  const resultados = busqueda.trim()
    ? productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : []

  const renderCard = (p) => (
    <CardHoriz
      key={p.id_producto}
      prod={p}
      fav={!!favoritos[p.id_producto]}
      onToggleFav={toggleFav}
      onAdd={agregarItem}
      rating={getRating(p.id_producto)}
      numResenas={numResenasDe(p)}
      onRate={(id, v) => setRatings(prev => ({ ...prev, [id]: v }))}
      onVerResenas={openResenas}
    />
  )

  if (cargando) {
    return (
      <div className="mn-layout">
        <Sidebar />
        <div className="mn-main" id="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#9abdc1' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>☕</div>
            Cargando el menú...
          </div>
        </div>
      </div>
    )
  }

  if (errorApi) {
    return (
      <div className="mn-layout">
        <Sidebar />
        <div className="mn-main" id="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#ef5350', padding: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
            {errorApi}
          </div>
        </div>
      </div>
    )
  }

  if (resenasScreen && prodActivo) {
    return (
      <div className="mn-layout">
        <Sidebar />
        <div className="mn-main" id="main">
          <div className="mn-resenas-wrap">
            <div className="mn-back-btn" onClick={() => setResenasScreen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Volver al menú
            </div>
            <div className="mn-rh-header">
              <div className="mn-rh-img">{prodActivo.i}</div>
              <div>
                <div className="mn-rh-name">{prodActivo.nombre}</div>
                <div className="mn-rh-avg">
                  <span className="mn-rh-avg-num">{getAvg(prodActivo.nombre)}</span>
                  <span className="mn-rh-stars">{starsStr(Math.round(parseFloat(getAvg(prodActivo.nombre))))}</span>
                </div>
                <div className="mn-rh-count">{numResenasDe(prodActivo)} reseñas</div>
              </div>
            </div>

            <div className="mn-add-resena">
              <div className="mn-ar-title">Deja tu reseña</div>
              <div className="mn-ar-stars">
                {[1,2,3,4,5].map(v => (
                  <span key={v} className="mn-ar-star" onClick={() => setArStar(v)}>
                    {v <= arStar ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <textarea
                className="mn-ar-input"
                rows="3"
                placeholder="¿Qué te pareció este producto?"
                value={arText}
                onChange={e => setArText(e.target.value)}
              />
              <button className="mn-ar-submit" onClick={submitResena}>Publicar reseña</button>
            </div>

            <div className="mn-filter-stars">
              {[0,5,4,3,2,1].map(v => (
                <button
                  key={v}
                  className={`mn-fs-btn ${filterStar === v ? 'active' : ''}`}
                  onClick={() => setFilterStar(v)}
                >
                  {v === 0 ? 'Todas' : `⭐ ${v}`}
                </button>
              ))}
            </div>

            {(() => {
              const data = (resenas[prodActivo.nombre] || []).filter(r => filterStar === 0 || r.s === filterStar)
              if (data.length === 0) return <div className="mn-no-resenas">No hay reseñas para este filtro 😕</div>
              return data.map((r, i) => (
                <div key={i} className="mn-resena-card">
                  <div className="mn-resena-top">
                    <span className="mn-resena-user">{r.u}</span>
                    <span className="mn-resena-date">{r.f}</span>
                  </div>
                  <div className="mn-resena-stars">{starsStr(r.s)}</div>
                  <div className="mn-resena-text">{r.t}</div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mn-layout">
      <Sidebar />
      <div className="mn-main" id="main">
        <div className="mn-sticky">
          <div className="mn-toprow">
            <div>
              <div className="mn-page-title">Nuestro menú</div>
              <div className="mn-page-sub">Explora bebidas, alimentos y combos especiales</div>
            </div>
            <div className="mn-search-wrap">
              <div className="mn-search-ico">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <input
                className="mn-search-input"
                type="text"
                placeholder="Buscar productos, bebidas o combos..."
                value={busqueda}
                onChange={e => { setBusqueda(e.target.value); setShowDrop(true) }}
                onBlur={() => setTimeout(() => setShowDrop(false), 200)}
                onFocus={() => busqueda && setShowDrop(true)}
              />
              {showDrop && busqueda && (
                <div className="mn-search-drop">
                  {resultados.length === 0
                    ? <div className="mn-no-res">No se encontraron productos 😕</div>
                    : resultados.map(p => (
                      <div key={p.id_producto} className="mn-search-item" onMouseDown={() => openFull(String(p.id_categoria))}>
                        <div className="mn-si-icon">{p.i}</div>
                        <div>
                          <div className="mn-si-name">{p.nombre}</div>
                          <div className="mn-si-cat">{p.categoria}</div>
                        </div>
                        <div className="mn-si-price">{Number(p.precio) > 0 ? `$${Number(p.precio).toFixed(2)}` : p.unidad}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            <div className="mn-cart-btn" onClick={() => navigate('/pedido')}>
              <div className="mn-cart-ico-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <div className="mn-cart-badge">{totalItems}</div>
              </div>
              <div>
                <div className="mn-cart-lbl">Ver pedido</div>
                <div className="mn-cart-price">${totalPrecio.toFixed(2)}</div>
              </div>
            </div>
          </div>
          <div className="mn-tabs">
            {[
              { k: 'menu', l: '⊞ Menú' },
              ...secciones.map(s => ({ k: s.key, l: `${s.icono} ${s.nombre}` })),
            ].map(t => (
              <button
                key={t.k}
                className={`mn-tab ${tabActivo === t.k ? 'active' : ''}`}
                onClick={() => t.k === 'menu' ? volverMenu() : openFull(t.k)}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mn-content">
          {screen === 'menu' && (
            <div>
              {seccionesNormales.map(sec => (
                <div key={sec.key} className="mn-sec-block">
                  <div className="mn-sec-header">
                    <div className="mn-sec-header-left">
                      <span className="mn-sec-icon">{sec.icono}</span>
                      <span className="mn-sec-title">{sec.nombre}</span>
                      <span className="mn-sec-popular">· más populares</span>
                    </div>
                    <div className="mn-ver-mas" onClick={() => openFull(sec.key)}>Ver todos ›</div>
                  </div>
                  <div className="mn-grid-horiz">
                    {sec.prods.slice(0, 4).map(p => renderCard(p))}
                  </div>
                </div>
              ))}

              {seccionPromos && seccionPromos.prods.length > 0 && (
                <div className="mn-sec-block">
                  <div className="mn-sec-header">
                    <div className="mn-sec-header-left">
                      <span className="mn-sec-icon">🏷️</span>
                      <span className="mn-sec-title">Promociones</span>
                    </div>
                    <div className="mn-ver-mas" onClick={() => openFull(seccionPromos.key)}>Ver todos ›</div>
                  </div>
                  <div className="mn-grid-horiz">
                    {seccionPromos.prods.slice(0, 4).map(p => renderCard(p))}
                  </div>
                </div>
              )}
            </div>
          )}

          {screen === 'full' && secActual && (
            <div>
              <div className="mn-back-btn" onClick={volverMenu}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Volver al menú
              </div>
              <div className="mn-full-header">
                <div className="mn-full-icon">{secActual.icono}</div>
                <div>
                  <div className="mn-full-name">{secActual.nombre}</div>
                  <div className="mn-full-sub">{secActual.prods.length} productos disponibles</div>
                </div>
              </div>
              {chipsActual.length > 1 && (
                <div className="mn-chips">
                  {chipsActual.map(c => (
                    <div
                      key={c.k}
                      className={`mn-chip ${chipActivo === c.k ? 'active' : ''}`}
                      onClick={() => setChipActivo(c.k)}
                    >
                      {c.l}
                    </div>
                  ))}
                </div>
              )}
              <div className="mn-grid-horiz">
                {prodsFull.map(p => renderCard(p))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu
