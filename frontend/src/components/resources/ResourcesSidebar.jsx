import { useState } from 'react'
import { requestResource } from '../../api/resources.api'

export default function ResourcesSidebar({ deptFilter, setDeptFilter, departments, onRequestResource }) {
  const [titre, setTitre]       = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleRequest = async () => {
    if (!titre.trim()) return
    try {
      await requestResource({ titre })
      setTitre('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const TRENDING = ['#QuantumPhysics', '#DataScience', '#Ethics', '#OrganicChemistry', '#GameTheory']

  return (
    <div className="w-64 shrink-0 flex flex-col gap-4">

      {/* Request Resource */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-sm text-[#0d1b2a] mb-1">Request Resource</h3>
        <p className="text-xs text-slate-400 mb-3">Can't find what you need? Ask the community.</p>
        <input
          value={titre}
          onChange={e => setTitre(e.target.value)}
          placeholder="Title of resource..."
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400/50 mb-2"
        />
        <button
          onClick={handleRequest}
          className="w-full py-2 bg-[#0d1b2a] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2f45] transition"
        >
          {submitted ? '✓ Demande envoyée !' : 'Submit Request'}
        </button>
      </div>

      {/* Browse by Department */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-sm text-[#0d1b2a] mb-3">Browse by Department</h3>
        <div className="space-y-1">
          {departments.filter(d => d !== 'Tous').map(dept => (
            <button
              key={dept}
              onClick={() => setDeptFilter(deptFilter === dept ? 'Tous' : dept)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition
                ${deptFilter === dept
                  ? 'bg-teal-50 text-teal-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <span>{dept}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-sm text-[#0d1b2a] mb-3">Trending Topics</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map(tag => (
            <button
              key={tag}
              className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-teal-50 hover:text-teal-600 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}