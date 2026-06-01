import { useState } from 'react'
import { removeConnection } from '../../api/network.api'
import { UserMinus } from 'lucide-react'

export default function ConnectionCard({ user, onUpdate }) {
  const [loading, setLoading] = useState(false)

  const handleRemove = async () => {
    if (!confirm(`Supprimer la connexion avec ${user.prenom} ?`)) return
    setLoading(true)
    try {
      await removeConnection(user.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white font-semibold shrink-0">
        {user.prenom?.[0] ?? 'U'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[#0d1b2a] truncate">
          {user.prenom} {user.nom}
        </p>
        <p className="text-xs text-slate-400 truncate">{user.filiere}</p>
        <p className="text-xs text-slate-400 truncate">{user.universite}</p>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={loading}
        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
      >
        <UserMinus size={15} />
      </button>
    </div>
  )
}