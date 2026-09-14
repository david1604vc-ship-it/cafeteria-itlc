import { useEffect } from 'react'

export function useScrollSidebar() {
  useEffect(() => {
    let lastY = 0

    const handle = () => {
      const currentY = window.scrollY
      const sidebar = document.getElementById('sidebar')
      const main = document.getElementById('main')
      if (!sidebar || !main) return

      if (currentY > lastY && currentY > 30) {
        sidebar.classList.add('collapsed')
        main.classList.add('collapsed')
      } else if (currentY < lastY) {
        sidebar.classList.remove('collapsed')
        main.classList.remove('collapsed')
      }
      lastY = currentY
    }

    window.addEventListener('scroll', handle)
    return () => window.removeEventListener('scroll', handle)
  }, [])
}