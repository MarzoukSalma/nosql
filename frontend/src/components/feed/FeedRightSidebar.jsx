import { TrendingUp, UserPlus } from 'lucide-react'

const trending = [
  { title: 'Quantum Computing Basics', followers: '2.4k' },
  { title: 'Neuroscience of Sleep', followers: '1.8k' },
  { title: 'Algorithmic Ethics', followers: '940' },
]

const suggested = [
  { name: 'Dr. Sarah Chen', role: 'ML Researcher' },
  { name: 'Marcus Thorne', role: 'Data Scientist' },
]

export default function FeedRightSidebar() {
  return (
    <div className="w-72 shrink-0 flex flex-col gap-4">
      {/* Resource of the Day */}
      <div className="bg-[#0d1b2a] rounded-2xl p-5 text-white">
        <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider mb-2">Resource of the Day</p>
        <h3 className="font-bold text-base leading-snug mb-2">Graph Neural Networks 101</h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          A comprehensive guide to understanding relational data in modern AI architectures.
        </p>
        <button className="text-xs font-semibold text-[#0d1b2a] bg-teal-400 hover:bg-teal-300 transition px-4 py-2 rounded-lg">
          Access Guide →
        </button>
      </div>

      {/* Trending Research */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-teal-500" />
          <h3 className="font-semibold text-sm text-[#0d1b2a]">Trending Research</h3>
        </div>
        <div className="space-y-3">
          {trending.map(t => (
            <div key={t.title} className="cursor-pointer hover:bg-slate-50 rounded-lg p-2 -mx-2 transition">
              <p className="text-xs text-slate-400">{t.followers} Students following</p>
              <p className="text-sm font-semibold text-[#0d1b2a]">{t.title}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full text-xs text-teal-600 font-semibold hover:underline">
          View Discovery Graph
        </button>
      </div>

      {/* Suggested Nodes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-sm text-[#0d1b2a] mb-4">Suggested Nodes</h3>
        <div className="space-y-3">
          {suggested.map(s => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {s.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0d1b2a]">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.role}</p>
                </div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-teal-600">
                <UserPlus size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}