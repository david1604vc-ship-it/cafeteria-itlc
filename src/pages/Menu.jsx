import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Menu.css'
import { useScrollSidebar } from '../hooks/useScrollSidebar'

const DATA = {
  comida: {
    icon: '🍽️', name: 'Comida', sub: 'Sándwiches, tortas, antojitos y más',
    chips: [
      { k: 'todos', l: 'Todos' }, { k: 'sandwich', l: '🥪 Sándwich' },
      { k: 'torta', l: '🫓 Tortas' }, { k: 'antojitos', l: '🌮 Antojitos' },
      { k: 'combos', l: '🍱 Combos' }, { k: 'otros', l: '🍽️ Otros' }
    ],
    prods: [
      { n: 'Club Sándwich', i: '🥪', p: 80, u: '1 plato', d: 'Triple con jamón, pollo, queso, lechuga, tomate y papas.', sub: 'sandwich' },
      { n: 'Sándwich Caprese', i: '🍅', p: 65, u: '1 pieza', d: 'Mozzarella, jitomate y albahaca fresca.', sub: 'sandwich' },
      { n: 'Sándwich de Pollo', i: '🐔', p: 70, u: '1 pieza', d: 'Pollo a la plancha con lechuga y tomate.', sub: 'sandwich' },
      { n: 'Torta de Milanesa', i: '🫓', p: 75, u: '1 pieza', d: 'Milanesa de res con frijoles y aguacate.', sub: 'torta' },
      { n: 'Torta Cubana', i: '🥩', p: 85, u: '1 pieza', d: 'Jamón, queso, chorizo y milanesa.', sub: 'torta' },
      { n: 'Tacos de Barbacoa', i: '🌮', p: 65, u: '3 piezas', d: 'Barbacoa de res con cilantro, cebolla y salsa.', sub: 'antojitos' },
      { n: 'Tacos al Pastor', i: '🌮', p: 60, u: '3 piezas', d: 'Cerdo al pastor con piña, cilantro y cebolla.', sub: 'antojitos' },
      { n: 'Quesadillas', i: '🫔', p: 55, u: '2 piezas', d: 'Con queso y opción de guisado.', sub: 'antojitos' },
      { n: 'Enchiladas Verdes', i: '🥗', p: 75, u: '4 piezas', d: 'Con salsa verde, crema y queso.', sub: 'antojitos' },
      { n: 'Combo Sándwich+Agua', i: '🍱', p: 85, u: '1 combo', d: 'Sándwich club + agua fresca del día.', sub: 'combos' },
      { n: 'Combo Tacos+Refresco', i: '🍱', p: 80, u: '1 combo', d: '3 tacos al pastor + refresco 600ml.', sub: 'combos' },
      { n: 'Morisqueta', i: '🍚', p: 85, u: '1 plato', d: 'Arroz, frijoles, carne asada y plátano.', sub: 'otros' },
      { n: 'Ensalada César', i: '🥗', p: 70, u: '1 plato', d: 'Lechuga romana, crutones y aderezo césar.', sub: 'otros' },
    ]
  },
  bebidas: {
    icon: '🥤', name: 'Bebidas', sub: 'Cafés, frappes, jugos y licuados',
    chips: [
      { k: 'todos', l: 'Todos' }, { k: 'cafe', l: '☕ Cafés' },
      { k: 'frappe', l: '🍫 Frappes' }, { k: 'jugo', l: '🍊 Jugos' },
      { k: 'licuado', l: '🥛 Licuados' }
    ],
    prods: [
      { n: 'Americano', i: '☕', p: 28, u: '1 vaso', d: 'Café espresso diluido en agua caliente.', sub: 'cafe' },
      { n: 'Cappuccino', i: '☕', p: 35, u: '1 vaso', d: 'Café espresso con espuma de leche.', sub: 'cafe' },
      { n: 'Latte', i: '☕', p: 38, u: '1 vaso', d: 'Espresso con leche vaporizada.', sub: 'cafe' },
      { n: 'Frappe Mocha', i: '🍫', p: 42, u: '1 vaso', d: 'Frappé con chocolate, crema batida y toque de chocolate.', sub: 'frappe' },
      { n: 'Frappe Caramelo', i: '🍮', p: 42, u: '1 vaso', d: 'Frappé con caramelo, crema batida y salsa de caramelo.', sub: 'frappe' },
      { n: 'Jugo de Naranja', i: '🍊', p: 28, u: '1 vaso', d: 'Jugo natural de naranja recién exprimida.', sub: 'jugo' },
      { n: 'Jugo Verde', i: '🥬', p: 30, u: '1 vaso', d: 'Nopal, piña, apio, manzana y limón.', sub: 'jugo' },
      { n: 'Licuado de Fresa', i: '🍓', p: 35, u: '1 vaso', d: 'Licuado de fresa con leche y azúcar.', sub: 'licuado' },
      { n: 'Licuado de Plátano', i: '🍌', p: 32, u: '1 vaso', d: 'Licuado de plátano con leche y canela.', sub: 'licuado' },
    ]
  },
  postres: {
    icon: '🍰', name: 'Postres', sub: 'Pasteles, muffins y más',
    chips: [
      { k: 'todos', l: 'Todos' }, { k: 'pastel', l: '🎂 Pasteles' },
      { k: 'muffin', l: '🧁 Muffins' }
    ],
    prods: [
      { n: 'Cheesecake de Fresa', i: '🍰', p: 50, u: '1 pieza', d: 'Suave cheesecake con cobertura de fresa.', sub: 'pastel' },
      { n: 'Pastel de Chocolate', i: '🎂', p: 42, u: '1 rebanada', d: 'Pastel de chocolate con cobertura cremosa.', sub: 'pastel' },
      { n: 'Pastel de Zanahoria', i: '🥕', p: 40, u: '1 rebanada', d: 'Con betún de queso crema.', sub: 'pastel' },
      { n: 'Muffin de Chocolate', i: '🧁', p: 25, u: '1 pieza', d: 'Suave muffin de chocolate con chispas.', sub: 'muffin' },
      { n: 'Muffin de Arándanos', i: '🫐', p: 25, u: '1 pieza', d: 'Muffin esponjoso con arándanos naturales.', sub: 'muffin' },
      { n: 'Muffin de Vainilla', i: '🧁', p: 22, u: '1 pieza', d: 'Suave muffin con betún de vainilla.', sub: 'muffin' },
    ]
  },
  otros: {
    icon: '🛍️', name: 'Otros', sub: 'Refrescos, sabritas, dulces y galletas',
    chips: [
      { k: 'todos', l: 'Todos' }, { k: 'refresco', l: '🥤 Refrescos' },
      { k: 'botana', l: '🍟 Botanas' }, { k: 'dulce', l: '🍬 Dulces' }
    ],
    prods: [
      { n: 'Refresco', i: '🥤', p: 22, u: '600ml', d: 'Variedad de sabores disponibles.', sub: 'refresco' },
      { n: 'Agua Mineral', i: '💧', p: 18, u: '600ml', d: 'Natural o con gas.', sub: 'refresco' },
      { n: 'Agua Fresca', i: '🧃', p: 20, u: '1 vaso', d: 'Jamaica, horchata o limón.', sub: 'refresco' },
      { n: 'Papas Sabritas', i: '🍟', p: 25, u: '1 bolsa', d: 'Papas fritas sabor original.', sub: 'botana' },
      { n: 'Chetos', i: '🧡', p: 20, u: '1 bolsa', d: 'Crujientes y deliciosos.', sub: 'botana' },
      { n: 'Dulces', i: '🍬', p: 10, u: '1 pieza', d: 'Variedad de dulces y gomitas.', sub: 'dulce' },
      { n: 'Galletas Oreo', i: '🍪', p: 20, u: '1 paquete', d: 'Galletas de chocolate clásicas.', sub: 'dulce' },
      { n: 'Chocolates', i: '🍫', p: 20, u: '1 pieza', d: 'Variedad de marcas y sabores.', sub: 'dulce' },
    ]
  },
  promociones: {
    icon: '🏷️', name: 'Promociones', sub: 'Combos y descuentos especiales',
    chips: [],
    prods: [
      { n: 'Sándwich + Bebida', i: '🥪', p: 85, u: 'Combo del día', d: 'Sándwich club + bebida incluida.', sub: 'combo' },
      { n: 'Descuento en café', i: '☕', p: 0, u: '20% OFF miércoles', d: 'En cafés seleccionados.', sub: 'descuento' },
      { n: 'Combo Tacos+Refresco', i: '🍱', p: 80, u: 'Precio especial', d: '3 tacos al pastor + refresco 600ml.', sub: 'combo' },
    ]
  }
}

const POPULARES = {
  comida:  ['Club Sándwich', 'Torta Cubana', 'Tacos de Barbacoa', 'Quesadillas'],
  bebidas: ['Cappuccino', 'Frappe Mocha', 'Jugo de Naranja', 'Licuado de Fresa'],
  postres: ['Cheesecake de Fresa', 'Pastel de Chocolate', 'Muffin de Chocolate', 'Muffin de Arándanos'],
  otros:   ['Refresco', 'Papas Sabritas', 'Dulces', 'Galletas Oreo'],
}

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
  'Tacos de Barbacoa': [
    { u: 'José M.', s: 4, t: 'Muy sabrosos, la barbacoa perfecta.', f: '06/05/2026' },
    { u: 'Elena R.', s: 4, t: 'Ricos y abundantes.', f: '05/05/2026' },
  ],
  'Quesadillas': [
    { u: 'Luisa P.', s: 3, t: 'Buenas, el queso podría ser más.', f: '05/05/2026' },
  ],
}

function StarRow({ prod, rating, numResenas, onRate, onVerResenas }) {
  return (
    <div>
      <div className="mn-stars-row">
        {[1,2,3,4,5].map(v => (
          <span
            key={v}
            className="mn-star"
            onClick={() => onRate(prod.n, v)}
          >
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
        <div className="mn-card-name">{prod.n}</div>
        <div className="mn-card-desc">{prod.d}</div>
        <div className="mn-card-unit">{prod.u}</div>
        <StarRow prod={prod} rating={rating} numResenas={numResenas} onRate={onRate} onVerResenas={onVerResenas} />
        <div className="mn-card-footer">
          <span className="mn-card-price">${prod.p}.00</span>
          <div className="mn-card-actions">
            <button
              className={`mn-fav-btn ${fav ? 'active' : ''}`}
              onClick={() => onToggleFav(prod.n)}
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

function Menu() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('menu')
  const [secActiva, setSecActiva] = useState(null)
  const [chipActivo, setChipActivo] = useState('todos')
  const [tabActivo, setTabActivo] = useState('menu')
  const [busqueda, setBusqueda] = useState('')
  const [showDrop, setShowDrop] = useState(false)
  const [carrito, setCarrito] = useState([])
  const [ratings, setRatings] = useState({})
  const [favoritos, setFavoritos] = useState({})
  const [resenasScreen, setResenasScreen] = useState(false)
  const [prodActivo, setProdActivo] = useState(null)
  const [arStar, setArStar] = useState(0)
  const [arText, setArText] = useState('')
  const [filterStar, setFilterStar] = useState(0)
  const [resenas, setResenas] = useState(RESENAS_INICIALES)

  useScrollSidebar()

  const totalItems = carrito.reduce((a, b) => a + b.qty, 0)
  const totalPrecio = carrito.reduce((a, b) => a + b.p * b.qty, 0)

  const agregarItem = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(x => x.n === prod.n)
      if (existe) return prev.map(x => x.n === prod.n ? { ...x, qty: x.qty + 1 } : x)
      return [...prev, { ...prod, qty: 1 }]
    })
  }

  const starsStr = (n) => '⭐'.repeat(n) + '☆'.repeat(5 - n)
  const getRating = (nombre) => ratings[nombre] ?? 3
  const getAvg = (nombre) => {
    const rs = resenas[nombre] || []
    if (rs.length === 0) return '0.0'
    return (rs.reduce((a, b) => a + b.s, 0) / rs.length).toFixed(1)
  }

  const toggleFav = (nombre) => setFavoritos(prev => ({ ...prev, [nombre]: !prev[nombre] }))

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
      [prodActivo.n]: [{ u: 'Tú', s: arStar, t: arText, f: 'Hoy' }, ...(prev[prodActivo.n] || [])]
    }))
    setArStar(0)
    setArText('')
  }

  const openFull = (sec) => {
    setSecActiva(sec)
    setChipActivo('todos')
    setScreen('full')
    setTabActivo(sec)
  }

  const volverMenu = () => {
    setScreen('menu')
    setTabActivo('menu')
  }

  const allProds = Object.entries(DATA).flatMap(([sec, d]) => d.prods.map(p => ({ ...p, sec })))
  const resultados = busqueda.trim()
    ? allProds.filter(p => p.n.toLowerCase().includes(busqueda.toLowerCase()))
    : []

  const prodsFull = secActiva
    ? (chipActivo === 'todos'
      ? DATA[secActiva].prods
      : DATA[secActiva].prods.filter(p => p.sub === chipActivo))
    : []

  const renderCard = (p) => (
    <CardHoriz
      key={p.n}
      prod={p}
      fav={!!favoritos[p.n]}
      onToggleFav={toggleFav}
      onAdd={agregarItem}
      rating={getRating(p.n)}
      numResenas={(resenas[p.n] || []).length}
      onRate={(nombre, v) => setRatings(prev => ({ ...prev, [nombre]: v }))}
      onVerResenas={openResenas}
    />
  )

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
                <div className="mn-rh-name">{prodActivo.n}</div>
                <div className="mn-rh-avg">
                  <span className="mn-rh-avg-num">{getAvg(prodActivo.n)}</span>
                  <span className="mn-rh-stars">{starsStr(Math.round(parseFloat(getAvg(prodActivo.n))))}</span>
                </div>
                <div className="mn-rh-count">{(resenas[prodActivo.n] || []).length} reseñas</div>
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
              const data = (resenas[prodActivo.n] || []).filter(r => filterStar === 0 || r.s === filterStar)
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
                    : resultados.map((p, i) => (
                      <div key={i} className="mn-search-item" onMouseDown={() => openFull(p.sec)}>
                        <div className="mn-si-icon">{p.i}</div>
                        <div>
                          <div className="mn-si-name">{p.n}</div>
                          <div className="mn-si-cat">{DATA[p.sec].name}</div>
                        </div>
                        <div className="mn-si-price">{p.p > 0 ? `$${p.p}.00` : p.u}</div>
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
              { k: 'comida', l: '🍽️ Comida' },
              { k: 'bebidas', l: '🥤 Bebidas' },
              { k: 'postres', l: '🍰 Postres' },
              { k: 'otros', l: '🛍️ Otros' },
              { k: 'promociones', l: '🏷️ Promociones' },
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
              {['comida', 'bebidas', 'postres', 'otros'].map(sec => (
                <div key={sec} className="mn-sec-block">
                  <div className="mn-sec-header">
                    <div className="mn-sec-header-left">
                      <span className="mn-sec-icon">{DATA[sec].icon}</span>
                      <span className="mn-sec-title">{DATA[sec].name}</span>
                      <span className="mn-sec-popular">· más populares</span>
                    </div>
                    <div className="mn-ver-mas" onClick={() => openFull(sec)}>Ver todos ›</div>
                  </div>
                  <div className="mn-grid-horiz">
                    {DATA[sec].prods
                      .filter(p => POPULARES[sec].includes(p.n))
                      .map(p => renderCard(p))
                    }
                  </div>
                </div>
              ))}

              <div className="mn-sec-block">
                <div className="mn-sec-header">
                  <div className="mn-sec-header-left">
                    <span className="mn-sec-icon">🏷️</span>
                    <span className="mn-sec-title">Promociones</span>
                  </div>
                  <div className="mn-ver-mas" onClick={() => openFull('promociones')}>Ver todos ›</div>
                </div>
                <div className="mn-grid-promo">
                  <div className="mn-promo-card">
                    <div className="mn-promo-info">
                      <div className="mn-promo-badge mn-badge-combo">Combo del día</div>
                      <div className="mn-promo-name">Sándwich + Bebida</div>
                      <p className="mn-promo-desc">Disfruta nuestro combo especial del día con bebida incluida.</p>
                      <div className="mn-promo-price">$85.00</div>
                    </div>
                    <div className="mn-promo-img">🥪</div>
                  </div>
                  <div className="mn-promo-card">
                    <div className="mn-promo-info">
                      <div className="mn-promo-badge mn-badge-desc">Descuento</div>
                      <div className="mn-promo-name">Descuento en café</div>
                      <p className="mn-promo-desc">Todos los miércoles 20% de descuento en cafés seleccionados.</p>
                      <div className="mn-promo-price" style={{ color: '#ff9800' }}>20% OFF</div>
                    </div>
                    <div className="mn-promo-img">☕</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {screen === 'full' && secActiva && (
            <div>
              <div className="mn-back-btn" onClick={volverMenu}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Volver al menú
              </div>
              <div className="mn-full-header">
                <div className="mn-full-icon">{DATA[secActiva].icon}</div>
                <div>
                  <div className="mn-full-name">{DATA[secActiva].name}</div>
                  <div className="mn-full-sub">{DATA[secActiva].sub}</div>
                </div>
              </div>
              {DATA[secActiva].chips.length > 0 && (
                <div className="mn-chips">
                  {DATA[secActiva].chips.map((c, i) => (
                    <div
                      key={i}
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