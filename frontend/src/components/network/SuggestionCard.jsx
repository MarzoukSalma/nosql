import { useState } from 'react'
import { sendRequest } from '../../api/network.api'
import { UserPlus, Users, Check } from 'lucide-react'

export default function SuggestionCard({ item, onUpdate }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  // Le backend retourne { etudiant, score, mutualCount, reason }
  const user = item.etudiant ?? item
  const mutualCount = item.mutualCount ?? 0
  const reason = item.reason ?? ''

  const handleConnect = async () => {
    setLoading(true)
    try {
      await sendRequest(user.id)
      setSent(true)
      onUpdate()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white font-semibold shrink-0">
            {user.prenom?.[0] ?? 'U'}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#0d1b2a]">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-slate-400">{user.filiere}</p>
            <p className="text-xs text-slate-400">{user.universite}</p>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={sent || loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition
            ${sent
              ? 'bg-teal-50 text-teal-600 cursor-default'
              : 'bg-[#0d1b2a] text-white hover:bg-[#1a2f45]'
            } disabled:opacity-60`}
        >
          {sent
            ? <><Check size={13} /> Sent</>
            : loading
              ? '...'
              : <><UserPlus size={13} /> Connect</>
          }
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {mutualCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={13} />
            {mutualCount} mutual connection{mutualCount > 1 ? 's' : ''}
          </div>
        )}
        {reason && (
          <span className="text-xs text-teal-600 font-medium ml-auto">{reason}</span>
        )}
      </div>
    </div>
  )
}