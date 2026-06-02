import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scroll window to top on every route change (SPA default keeps scroll position). */
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}
