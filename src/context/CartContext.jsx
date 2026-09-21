import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'carrito_itlc'

function leerCarrito() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito)
  // Último pedido confirmado (para las pantallas de éxito)
  const [ultimoPedido, setUltimoPedido] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito))
  }, [carrito])

  const agregarItem = (prod) => {
    setCarrito(prev => {
      const existe = prev.find(x => x.id_producto === prod.id_producto)
      if (existe) {
        return prev.map(x =>
          x.id_producto === prod.id_producto ? { ...x, qty: x.qty + 1 } : x
        )
      }
      return [...prev, {
        id_producto: prod.id_producto,
        n: prod.nombre,
        i: prod.imagen_url || '🍽️',
        p: Number(prod.precio),
        u: prod.unidad || '',
        qty: 1,
      }]
    })
  }

  const cambiarCantidad = (id_producto, delta) => {
    setCarrito(prev =>
      prev
        .map(x => (x.id_producto === id_producto ? { ...x, qty: x.qty + delta } : x))
        .filter(x => x.qty > 0)
    )
  }

  const setCantidad = (id_producto, qty) => {
    setCarrito(prev =>
      qty <= 0
        ? prev.filter(x => x.id_producto !== id_producto)
        : prev.map(x => (x.id_producto === id_producto ? { ...x, qty } : x))
    )
  }

  const eliminarItem = (id_producto) =>
    setCarrito(prev => prev.filter(x => x.id_producto !== id_producto))

  const vaciar = () => setCarrito([])

  const totalItems = carrito.reduce((a, b) => a + b.qty, 0)
  const totalPrecio = carrito.reduce((a, b) => a + b.p * b.qty, 0)

  const value = {
    carrito, ultimoPedido, setUltimoPedido,
    agregarItem, cambiarCantidad, setCantidad, eliminarItem, vaciar,
    totalItems, totalPrecio,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
