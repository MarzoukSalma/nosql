import { useState, useEffect } from 'react'
import { getConnections, getPendingRequests, getSuggestions } from '../../api/network.api'
import PendingRequests from '../../components/network/PendingRequests'
import SuggestionCard from '../../components/network/SuggestionCard'
import ConnectionCard from '../../components/network/ConnectionCard'
import { Users, UserPlus, Compass } from 'lucide-react'

const toNumber = (val) => {
  if (!val) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'object' && 'low' in val) return val.low
  return Number(val)
}

export default function NetworkPage() {
  const [connections, setConnections]   = useState([])
  const [requests, setRequests]         = useState([])
  const [suggestions, setSuggestions]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeTab, setActiveTab]       = useState('suggestions') // suggestions | connections

  const loadAll = async () => {
    setLoading(true)
    try {
      const [connRes, reqRes, sugRes] = await Promise.all([
        getConnections(),
        getPendingRequests(),
        getSuggestions(10),
      ])
      setConnections(connRes.data.data ?? [])
      setRequests(reqRes.data.data ?? [])
      setSuggestions(sugRes.data.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const tabs = [
    { key: 'suggestions', label: 'Discover', icon: Compass },
    { key: 'connections', label: `Connections (${toNumber(connections.length)})`, icon: Users },
  ]

  return (
    <div className="flex gap-6 max-w-6xl mx-auto px-6 py-6">

      {/* Main */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Tabs */}
        <div className="flex gap-2 bg-white rounded-2xl border border-slate-200 p-1.5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 rounded-xl text-sm font-medium transition
                ${activeTab === tab.key
                  ? 'bg-[#0d1b2a] text-white'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === 'suggestions' ? (
          <div className="grid grid-cols-2 gap-4">
            {suggestions.length === 0 ? (
              <p className="col-span-2 text-center text-slate-400 py-12">Aucune suggestion pour le moment</p>
            ) : suggestions.map((item, i) => (
              <SuggestionCard key={i} item={item} onUpdate={loadAll} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {connections.length === 0 ? (
              <p className="col-span-2 text-center text-slate-400 py-12">Aucune connexion pour le moment</p>
            ) : connections.map(user => (
              <ConnectionCard key={user.id} user={user} onUpdate={loadAll} />
            ))}
          </div>
        )}
      </div>

      {/* Right sidebar — Pending Requests */}
      <div className="w-72 shrink-0">
        <PendingRequests requests={requests} onUpdate={loadAll} />
      </div>
    </div>
  )
}