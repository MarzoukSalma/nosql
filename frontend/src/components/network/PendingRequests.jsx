import { acceptRequest, declineRequest } from '../../api/network.api'
import { Check, X } from 'lucide-react'

export default function PendingRequests({ requests, onUpdate }) {
  const handleAccept = async (userId) => {
    try {
      await acceptRequest(userId)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecline = async (userId) => {
    try {
      await declineRequest(userId)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-[#0d1b2a]">Pending Requests</h3>
        {requests.length > 0 && (
          <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full">
            {requests.length}
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">Aucune demande en attente</p>
      ) : (
        <div className="space-y-3">
          {requests.map(user => (
            <div key={user.id} className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {user.prenom?.[0] ?? 'U'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0d1b2a] truncate">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.filiere}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => handleAccept(user.id)}
                  className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => handleDecline(user.id)}
                  className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}