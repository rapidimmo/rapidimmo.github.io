import {
  Wifi,
  CookingPot,
  Droplets,
  Snowflake,
  Car,
  ShieldCheck,
  ArrowUpDown,
  Trees,
  Check,
} from 'lucide-react'
import { equipementLabel } from '../utils/constants'

const MAP = {
  wifi: Wifi,
  cuisine_equipee: CookingPot,
  eau_chaude: Droplets,
  climatisation: Snowflake,
  parking: Car,
  gardien: ShieldCheck,
  ascenseur: ArrowUpDown,
  terrasse: Trees,
}

export default function EquipementIcon({ value, size = 18 }) {
  const Icon = MAP[value] || Check
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-sm text-primary-900/80">
      <Icon size={size} className="text-secondary-600" />
      {equipementLabel(value)}
    </span>
  )
}
