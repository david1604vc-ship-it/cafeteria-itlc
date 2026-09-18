import { useState } from 'react'
import api from '../api/axios'
import './Admin.css'

function Sidebar({ screen, goTo }) {
  return (
    <div className="ad-sidebar">
      <div className="ad-brand">
        <div className="ad-avatar">👤</div>
        <div>
          <div className="ad-name">Administrador</div>
          <div className="ad-role">Panel de control</div>
        </div>
      </div>
      <nav className="ad-nav">
        <div className={`ad-item ${screen === 'dashboard' ? 'active' : ''}`} onClick={() => goTo('dashboard')}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Administrador
        </div>
        <div className={`ad-item ${screen === 'usuarios' ? 'active' : ''}`} onClick={() => goTo('usuarios')}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Usuarios
        </div>
        <div className={`ad-item ${screen === 'categorias' ? 'active' : ''}`} onClick={() => goTo('categorias')}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Categorías
        </div>
        <div className={`ad-item ${screen === 'productos' ? 'active' : ''}`} onClick={() => goTo('productos')}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          Productos
        </div>
        <div className={`ad-item ${screen === 'historial' ? 'active' : ''}`} onClick={() => goTo('historial')}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Historial
        </div>

      </nav>
      <div className="ad-footer">
        <div className="ad-logout" onClick={() => { localStorage.clear(); window.location.href = '/' }}>
          <svg className="ad-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </div>
      </div>
    </div>
  )
}

function Admin() {
  const [screen, setScreen] = useState('dashboard')
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const goTo = (s) => {
    setScreen(s)
    if (s === 'usuarios') cargarUsuarios()
  }

  const cargarUsuarios = async () => {
    setCargando(true)
    setError('')
    try {
      const res = await api.get('/usuarios')
      setUsuarios(res.data)
    } catch {
      setError('Error al cargar usuarios')
    } finally {
      setCargando(false)
    }
  }

  const cambiarEstado = async (id, activo) => {
    try {
      await api.put(`/usuarios/${id}/estado`, { activo: activo ? 0 : 1 })
      cargarUsuarios()
    } catch {
      alert('Error al cambiar estado')
    }
  }

  const desbloquear = async (id) => {
    try {
      await api.put(`/usuarios/${id}/desbloquear`)
      cargarUsuarios()
    } catch {
      alert('Error al desbloquear')
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return
    try {
      await api.delete(`/usuarios/${id}`)
      cargarUsuarios()
    } catch {
      alert('Error al eliminar usuario')
    }
  }

  return (
    <div className="ad-layout">
      <Sidebar screen={screen} goTo={goTo} />
      <div className="ad-main">

        {/* DASHBOARD */}
        {screen === 'dashboard' && (
          <div>
            <div className="ad-page-header">
              <div>
                <div className="ad-page-title">¡Bienvenido de nuevo, Administrador!</div>
                <div className="ad-page-sub">
                  Resumen de hoy · {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="ad-stats-grid">
              <div className="ad-stat-card">
                <div><div className="ad-stat-label">Ventas del día</div><div className="ad-stat-val green">$2,560.00</div></div>
                <div className="ad-stat-ico green">💰</div>
              </div>
              <div className="ad-stat-card">
                <div><div className="ad-stat-label">Pedidos del día</div><div className="ad-stat-val blue">32</div></div>
                <div className="ad-stat-ico blue">🛒</div>
              </div>
              <div className="ad-stat-card">
                <div><div className="ad-stat-label">Productos vendidos</div><div className="ad-stat-val amber">89</div></div>
                <div className="ad-stat-ico amber">🛍️</div>
              </div>
            </div>
            <div className="ad-section-title">Accesos rápidos</div>
            <div className="ad-accesos">
              {[
                { icon: '👥', label: 'Usuarios', screen: 'usuarios' },
                { icon: '⊞', label: 'Categorías', screen: 'categorias' },
                { icon: '🛍️', label: 'Productos', screen: 'productos' },
                { icon: '🕐', label: 'Historial', screen: 'historial' },
              ].map(a => (
                <div key={a.screen} className="ad-acceso" onClick={() => goTo(a.screen)}>
                  <div className="ad-acceso-icon">{a.icon}</div>
                  <div className="ad-acceso-label">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USUARIOS */}
        {screen === 'usuarios' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Gestión de usuarios</div></div>
            </div>
            {error && <p style={{ color: '#ef5350', marginBottom: '12px', fontSize: '13px' }}>{error}</p>}
            {cargando ? (
              <p style={{ color: '#9abdc1', fontSize: '13px' }}>Cargando usuarios...</p>
            ) : (
              <div className="ad-table-card">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Intentos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id_usuario}>
                        <td>{u.id_usuario}</td>
                        <td>{u.nombre} {u.apellido}</td>
                        <td>{u.telefono}</td>
                        <td>
                          <span className={`ad-badge ${u.activo ? 'ad-badge-activo' : 'ad-badge-inactivo'}`}>
                            {u.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          {u.intentos_fallidos >= 5
                            ? <span className="ad-badge ad-badge-inactivo">🔒 Bloqueado</span>
                            : u.intentos_fallidos
                          }
                        </td>
                        <td>
                          <div className="ad-action-btns">
                            <button
                              className={`ad-act-btn ${u.activo ? 'ad-act-baja' : 'ad-act-edit'}`}
                              title={u.activo ? 'Desactivar' : 'Activar'}
                              onClick={() => cambiarEstado(u.id_usuario, u.activo)}
                            >
                              {u.activo ? '⏸️' : '▶️'}
                            </button>
                            {u.intentos_fallidos >= 5 && (
                              <button
                                className="ad-act-btn ad-act-edit"
                                title="Desbloquear"
                                onClick={() => desbloquear(u.id_usuario)}
                              >
                                🔓
                              </button>
                            )}
                            <button
                              className="ad-act-btn ad-act-del"
                              title="Eliminar"
                              onClick={() => eliminar(u.id_usuario)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="ad-legend" style={{ marginTop: '12px' }}>
              <span>⏸️ Desactivar</span>
              <span>▶️ Activar</span>
              <span>🔓 Desbloquear</span>
              <span>🗑️ Eliminar</span>
            </div>
          </div>
        )}

        {/* CATEGORÍAS */}
        {screen === 'categorias' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Categorías</div></div>
              <button className="ad-btn-primary">+ Nueva categoría</button>
            </div>
            <div className="ad-table-card">
              <table className="ad-table">
                <thead><tr><th>ID</th><th>Categoría</th><th>Estado</th><th>Acciones</th></tr></thead>
                <tbody>
                  {['Comidas', 'Bebidas', 'Postres', 'Otros', 'Promociones'].map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{c}</td>
                      <td><span className="ad-badge ad-badge-cat">Activa</span></td>
                      <td>
                        <div className="ad-action-btns">
                          <button className="ad-act-btn ad-act-edit">✏️</button>
                          <button className="ad-act-btn ad-act-del">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTOS */}
        {screen === 'productos' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Productos</div></div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input className="ad-search-input" placeholder="Buscar producto..." />
                <button className="ad-btn-primary">+ Nuevo producto</button>
              </div>
            </div>
            <div className="ad-table-card">
              <table className="ad-table">
                <thead>
                  <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, n: 'Hamburguesa Clásica', cat: 'Comidas', p: '$65.00', stock: 25 },
                    { id: 2, n: 'Club Sándwich', cat: 'Comidas', p: '$70.00', stock: 18 },
                    { id: 3, n: 'Café Americano', cat: 'Bebidas', p: '$30.00', stock: 40 },
                    { id: 4, n: 'Capuchino', cat: 'Bebidas', p: '$45.00', stock: 35 },
                    { id: 5, n: 'Brownie', cat: 'Postres', p: '$40.00', stock: 22 },
                  ].map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.n}</td>
                      <td>{p.cat}</td>
                      <td>{p.p}</td>
                      <td>{p.stock}</td>
                      <td>
                        <div className="ad-action-btns">
                          <button className="ad-act-btn ad-act-edit">✏️</button>
                          <button className="ad-act-btn ad-act-stock">📦</button>
                          <button className="ad-act-btn ad-act-del">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="ad-legend" style={{ marginTop: '12px' }}>
              <span>✏️ Editar producto y precio</span>
              <span>📦 Editar stock</span>
              <span>🗑️ Eliminar</span>
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {screen === 'historial' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Historial de ventas</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="date" className="ad-date-input" defaultValue={new Date().toISOString().split('T')[0]} />
                <button className="ad-btn-primary">Filtrar</button>
              </div>
            </div>
            <div className="ad-table-card">
              <table className="ad-table">
                <thead>
                  <tr><th>Folio</th><th>Hora</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Pago</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {[
                    { f: '1001', h: '09:15 AM', c: 'Juan Pérez', p: '2x Café, 1x Brownie', t: '$105.00', m: 'Efectivo' },
                    { f: '1002', h: '10:30 AM', c: 'María Gómez', p: '1x Hamburguesa, 1x Agua', t: '$85.00', m: 'Tarjeta' },
                    { f: '1003', h: '11:45 AM', c: 'Carlos López', p: '1x Club Sándwich, 1x Capuchino', t: '$115.00', m: 'Efectivo' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td>{r.f}</td><td>{r.h}</td><td>{r.c}</td>
                      <td>{r.p}</td><td>{r.t}</td><td>{r.m}</td>
                      <td><button className="ad-act-btn ad-act-view">👁️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid #f0fafc' }}>
                <span className="ad-total-label" style={{ marginRight: '8px' }}>Total del día:</span>
                <span className="ad-total-val">$305.00</span>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  )
}

export default Admin