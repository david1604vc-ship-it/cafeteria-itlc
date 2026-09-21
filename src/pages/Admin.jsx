import { useState, useEffect } from 'react'
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

// ── Modal de producto (crear / editar) ───────────────────────────────────

const PRODUCTO_VACIO = {
  id_categoria: '', nombre: '', descripcion: '', precio: '',
  unidad: '', subcategoria: '', imagen_url: '', disponible: 1,
}

function ModalProducto({ inicial, categorias, onCerrar, onGuardado }) {
  const [form, setForm] = useState(inicial || PRODUCTO_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const esEdicion = !!(inicial && inicial.id_producto)

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const guardar = async () => {
    if (!form.id_categoria || !form.nombre.trim() || form.precio === '' || isNaN(Number(form.precio))) {
      setError('Completa categoría, nombre y un precio válido')
      return
    }
    setGuardando(true)
    setError('')
    try {
      const payload = {
        id_categoria: Number(form.id_categoria),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        unidad: form.unidad.trim(),
        subcategoria: form.subcategoria.trim().toLowerCase(),
        imagen_url: form.imagen_url.trim(),
        disponible: Number(form.disponible),
      }
      if (esEdicion) {
        await api.put(`/menu/productos/${inicial.id_producto}`, payload)
      } else {
        await api.post('/menu/productos', payload)
      }
      onGuardado()
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar el producto')
      setGuardando(false)
    }
  }

  return (
    <div className="ad-modal-overlay" onClick={onCerrar}>
      <div className="ad-modal" onClick={e => e.stopPropagation()}>
        <div className="ad-modal-header">
          <span className="ad-modal-title">{esEdicion ? '✏️ Editar producto' : '➕ Nuevo producto'}</span>
          <button className="ad-modal-close" onClick={onCerrar}>✕</button>
        </div>

        <div className="ad-modal-body">
          <div className="ad-form-grid">
            <label className="ad-field">
              <span>Categoría *</span>
              <select value={form.id_categoria} onChange={e => set('id_categoria', e.target.value)}>
                <option value="">Selecciona...</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.icono} {c.nombre}</option>
                ))}
              </select>
            </label>
            <label className="ad-field">
              <span>Precio ($) *</span>
              <input
                type="number" min="0" step="0.01"
                value={form.precio}
                onChange={e => set('precio', e.target.value)}
                placeholder="0.00"
              />
            </label>
            <label className="ad-field ad-field-full">
              <span>Nombre *</span>
              <input
                type="text" maxLength={100}
                value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                placeholder="Ej: Café Americano"
              />
            </label>
            <label className="ad-field ad-field-full">
              <span>Descripción</span>
              <textarea
                rows="2" maxLength={300}
                value={form.descripcion}
                onChange={e => set('descripcion', e.target.value)}
                placeholder="Descripción corta del producto"
              />
            </label>
            <label className="ad-field">
              <span>Unidad</span>
              <input
                type="text" maxLength={50}
                value={form.unidad}
                onChange={e => set('unidad', e.target.value)}
                placeholder="Ej: 1 vaso, 3 piezas"
              />
            </label>
            <label className="ad-field">
              <span>Subcategoría</span>
              <input
                type="text" maxLength={50}
                value={form.subcategoria}
                onChange={e => set('subcategoria', e.target.value)}
                placeholder="Ej: cafe, frappe, sandwich"
              />
            </label>
            <label className="ad-field ad-field-full">
              <span>Emoji / imagen (opcional)</span>
              <input
                type="text" maxLength={255}
                value={form.imagen_url}
                onChange={e => set('imagen_url', e.target.value)}
                placeholder="☕ o URL de imagen"
              />
            </label>
            <label className="ad-field">
              <span>Estado</span>
              <select value={form.disponible} onChange={e => set('disponible', e.target.value)}>
                <option value="1">Disponible</option>
                <option value="0">Oculto (no disponible)</option>
              </select>
            </label>
          </div>
          {error && <div className="ad-form-error">{error}</div>}
        </div>

        <div className="ad-modal-footer">
          <button className="ad-btn-secondary" onClick={onCerrar} disabled={guardando}>Cancelar</button>
          <button className="ad-btn-primary" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </button>
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

  // Stats del dashboard
  const [stats, setStats] = useState(null)

  // Productos
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [busquedaProd, setBusquedaProd] = useState('')
  const [modalProducto, setModalProducto] = useState(null) // null | PRODUCTO_VACIO | producto a editar

  // Historial
  const [pedidos, setPedidos] = useState([])
  const [filtroFecha, setFiltroFecha] = useState('')
  const [detallePedido, setDetallePedido] = useState(null)

  const cargarStats = async () => {
    try {
      const res = await api.get('/pedidos/stats/hoy')
      setStats(res.data)
    } catch {
      setStats(null)
    }
  }

  const goTo = (s) => {
    setScreen(s)
    if (s === 'usuarios') cargarUsuarios()
    if (s === 'productos') cargarProductos()
    if (s === 'dashboard') cargarStats()
    if (s === 'historial') cargarPedidos()
  }

  useEffect(() => {
    let vivo = true
    ;(async () => {
      try {
        const res = await api.get('/pedidos/stats/hoy')
        if (vivo) setStats(res.data)
      } catch {
        if (vivo) setStats(null)
      }
    })()
    return () => { vivo = false }
  }, [])

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

  const cargarProductos = async () => {
    setCargando(true)
    setError('')
    try {
      const [prods, cats] = await Promise.all([
        api.get('/menu/admin/productos'),
        api.get('/menu/categorias'),
      ])
      setProductos(prods.data)
      setCategorias(cats.data)
    } catch {
      setError('Error al cargar productos')
    } finally {
      setCargando(false)
    }
  }

  const toggleDisponible = async (p) => {
    try {
      await api.put(`/menu/productos/${p.id_producto}`, { disponible: p.disponible ? 0 : 1 })
      cargarProductos()
    } catch {
      alert('Error al cambiar disponibilidad')
    }
  }

  const eliminarProducto = async (p) => {
    if (!window.confirm(`¿Ocultar "${p.nombre}" del menú? Podrás reactivarlo después.`)) return
    try {
      await api.delete(`/menu/productos/${p.id_producto}`)
      cargarProductos()
    } catch {
      alert('Error al eliminar el producto')
    }
  }

  const cargarPedidos = async () => {
    setCargando(true)
    setError('')
    try {
      const res = await api.get('/pedidos/todos')
      setPedidos(res.data)
    } catch {
      setError('Error al cargar el historial')
    } finally {
      setCargando(false)
    }
  }

  const cambiarEstadoPedido = async (id, nuevo) => {
    try {
      await api.put(`/pedidos/${id}/estado`, { estado: nuevo })
      cargarPedidos()
    } catch {
      alert('Error al actualizar estado')
    }
  }

  const fmtFecha = (f) => f
    ? new Date(f).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : ''
  const fmtHora = (f) => f
    ? new Date(f).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
    : ''

  const pedidosFiltrados = filtroFecha
    ? pedidos.filter(p => p.creado_en && p.creado_en.startsWith(filtroFecha))
    : pedidos

  const totalDia = pedidosFiltrados.reduce((a, b) => a + Number(b.total), 0)

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
                <div><div className="ad-stat-label">Ventas del día</div><div className="ad-stat-val green">${stats ? stats.ventas_dia.toFixed(2) : '—'}</div></div>
                <div className="ad-stat-ico green">💰</div>
              </div>
              <div className="ad-stat-card">
                <div><div className="ad-stat-label">Pedidos del día</div><div className="ad-stat-val blue">{stats ? stats.pedidos_dia : '—'}</div></div>
                <div className="ad-stat-ico blue">🛒</div>
              </div>
              <div className="ad-stat-card">
                <div><div className="ad-stat-label">Productos vendidos</div><div className="ad-stat-val amber">{stats ? stats.productos_vendidos : '—'}</div></div>
                <div className="ad-stat-ico amber">🛍️</div>
              </div>
            </div>
            <div className="ad-section-title">Accesos rápidos</div>
            <div className="ad-accesos">
              {[
                { icon: '👥', label: 'Usuarios', screen: 'usuarios' },
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
                <div className="ad-table-scroll">
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

        {/* PRODUCTOS */}
        {screen === 'productos' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Productos</div></div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  className="ad-search-input"
                  placeholder="Buscar producto..."
                  value={busquedaProd}
                  onChange={e => setBusquedaProd(e.target.value)}
                />
                <button className="ad-btn-primary" onClick={() => setModalProducto(PRODUCTO_VACIO)}>+ Nuevo producto</button>
              </div>
            </div>
            {error && <p style={{ color: '#ef5350', marginBottom: '12px', fontSize: '13px' }}>{error}</p>}
            {cargando ? (
              <p style={{ color: '#9abdc1', fontSize: '13px' }}>Cargando productos...</p>
            ) : (
              <div className="ad-table-card">
                <div className="ad-table-scroll">
                <table className="ad-table">
                  <thead>
                    <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {productos
                      .filter(p => p.nombre.toLowerCase().includes(busquedaProd.toLowerCase()))
                      .map(p => (
                      <tr key={p.id_producto} style={{ opacity: p.disponible ? 1 : 0.55 }}>
                        <td>{p.id_producto}</td>
                        <td>
                          <span style={{ marginRight: '6px' }}>{p.imagen_url || p.categoria_icono || '🍽️'}</span>
                          {p.nombre}
                        </td>
                        <td>{p.categoria_icono} {p.categoria}</td>
                        <td>${Number(p.precio).toFixed(2)}</td>
                        <td>
                          <span className={`ad-badge ${p.disponible ? 'ad-badge-activo' : 'ad-badge-inactivo'}`}>
                            {p.disponible ? 'Disponible' : 'Oculto'}
                          </span>
                        </td>
                        <td>
                          <div className="ad-action-btns">
                            <button
                              className="ad-act-btn ad-act-edit"
                              title="Editar"
                              onClick={() => setModalProducto({
                                id_producto: p.id_producto,
                                id_categoria: String(p.id_categoria),
                                nombre: p.nombre,
                                descripcion: p.descripcion || '',
                                precio: String(p.precio),
                                unidad: p.unidad || '',
                                subcategoria: p.subcategoria || '',
                                imagen_url: p.imagen_url || '',
                                disponible: p.disponible,
                              })}
                            >
                              ✏️
                            </button>
                            <button
                              className="ad-act-btn ad-act-stock"
                              title={p.disponible ? 'Ocultar del menú' : 'Mostrar en el menú'}
                              onClick={() => toggleDisponible(p)}
                            >
                              {p.disponible ? '👁️' : '🚫'}
                            </button>
                            <button
                              className="ad-act-btn ad-act-del"
                              title="Ocultar (baja lógica)"
                              onClick={() => eliminarProducto(p)}
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
              </div>
            )}
            <div className="ad-legend" style={{ marginTop: '12px' }}>
              <span>✏️ Editar producto y precio</span>
              <span>👁️ / 🚫 Mostrar u ocultar en el menú</span>
              <span>🗑️ Dar de baja</span>
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        {screen === 'historial' && (
          <div>
            <div className="ad-page-header">
              <div><div className="ad-page-title">Historial de pedidos</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="date"
                  className="ad-date-input"
                  value={filtroFecha}
                  onChange={e => setFiltroFecha(e.target.value)}
                />
                {filtroFecha && (
                  <button className="ad-btn-secondary" onClick={() => setFiltroFecha('')}>Ver todo</button>
                )}
              </div>
            </div>
            {error && <p style={{ color: '#ef5350', marginBottom: '12px', fontSize: '13px' }}>{error}</p>}
            {cargando ? (
              <p style={{ color: '#9abdc1', fontSize: '13px' }}>Cargando pedidos...</p>
            ) : pedidosFiltrados.length === 0 ? (
              <div className="ad-table-card" style={{ padding: '30px', textAlign: 'center', color: '#9abdc1' }}>
                Aún no hay pedidos registrados 🍽️
              </div>
            ) : (
              <div className="ad-table-card">
                <div className="ad-table-scroll">
                <table className="ad-table">
                  <thead>
                    <tr><th>Folio</th><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Pago</th><th>Estado</th><th></th></tr>
                  </thead>
                  <tbody>
                    {pedidosFiltrados.map(p => (
                      <tr key={p.id_pedido}>
                        <td><strong>{p.folio}</strong></td>
                        <td>{fmtFecha(p.creado_en)}</td>
                        <td>{fmtHora(p.creado_en)}</td>
                        <td>{p.nombre} {p.apellido}</td>
                        <td>
                          {p.productos && p.productos.length > 0
                            ? p.productos.map(d => `${d.cantidad}x ${d.nombre}`).join(', ').slice(0, 40) + (p.productos.reduce((a,b)=>a+b.cantidad,0) > 0 && p.productos.map(d=>d.nombre).join('').length > 40 ? '...' : '')
                            : '—'}
                        </td>
                        <td>${Number(p.total).toFixed(2)}</td>
                        <td>{p.metodo_pago ? p.metodo_pago.charAt(0).toUpperCase() + p.metodo_pago.slice(1) : '—'}</td>
                        <td>
                          <select
                            className="ad-estado-select ad-estado-pendiente"
                            value={p.estado}
                            onChange={e => cambiarEstadoPedido(p.id_pedido, e.target.value)}
                          >
                            {['pendiente', 'preparando', 'listo', 'entregado', 'cancelado'].map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <button className="ad-act-btn ad-act-view" title="Ver detalle" onClick={() => setDetallePedido(p)}>👁️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid #f0fafc' }}>
                  <span className="ad-total-label" style={{ marginRight: '8px' }}>
                    Total{filtroFecha ? ' del día' : ` (${pedidosFiltrados.length} pedidos)`}:
                  </span>
                  <span className="ad-total-val">${totalDia.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modal de producto */}
      {modalProducto && (
        <ModalProducto
          inicial={modalProducto.id_producto ? modalProducto : null}
          categorias={categorias}
          onCerrar={() => setModalProducto(null)}
          onGuardado={() => {
            setModalProducto(null)
            cargarProductos()
            cargarStats()
          }}
        />
      )}

      {/* Modal de detalle de pedido */}
      {detallePedido && (
        <div className="ad-modal-overlay" onClick={() => setDetallePedido(null)}>
          <div className="ad-modal" onClick={e => e.stopPropagation()}>
            <div className="ad-modal-header">
              <span className="ad-modal-title">Pedido {detallePedido.folio}</span>
              <button className="ad-modal-close" onClick={() => setDetallePedido(null)}>✕</button>
            </div>
            <div className="ad-modal-body">
              <div className="ad-detalle-row"><strong>Cliente:</strong> {detallePedido.nombre} {detallePedido.apellido} ({detallePedido.telefono})</div>
              <div className="ad-detalle-row"><strong>Fecha:</strong> {fmtFecha(detallePedido.creado_en)} {fmtHora(detallePedido.creado_en)}</div>
              <div className="ad-detalle-row"><strong>Estado:</strong> {detallePedido.estado} · <strong>Pago:</strong> {detallePedido.metodo_pago || '—'}</div>
              {detallePedido.nota && <div className="ad-detalle-row"><strong>Nota para cocina:</strong> {detallePedido.nota}</div>}
              <table className="ad-table" style={{ marginTop: '10px' }}>
                <thead><tr><th>Producto</th><th>Cant.</th><th>P. unitario</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {(detallePedido.productos || []).map(d => (
                    <tr key={d.id_detalle}>
                      <td>{d.nombre}</td>
                      <td>{d.cantidad}</td>
                      <td>${Number(d.precio_unitario).toFixed(2)}</td>
                      <td>${Number(d.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <span className="ad-total-label" style={{ marginRight: '8px' }}>Total:</span>
                <span className="ad-total-val">${Number(detallePedido.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
