import { Wand2 } from 'lucide-react'
import { useShop } from '../../context/ShopContext'

export default function CustomOrderButton({ className = '', children, defaults = null }) {
  const { openCustomStudio } = useShop()

  return (
    <button
      type="button"
      onClick={() => openCustomStudio(defaults)}
      className={className || 'btn-outline text-xs px-5 py-2.5 bg-white inline-flex items-center gap-1.5'}
    >
      {children || (
        <>
          <Wand2 size={15} className="text-terracotta-600" />
          <span>Request Custom Order</span>
        </>
      )}
    </button>
  )
}
