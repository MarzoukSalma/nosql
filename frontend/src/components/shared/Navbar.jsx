import { Bell, Mail, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search academic nodes..."
          className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-teal-400/50 transition"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-800">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full" />
        </button>

        {/* Messages */}
        <button
          onClick={() => navigate('/messages')}
          className="p-2 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-800"
        >
          <Mail size={19} />
        </button>

        {/* Avatar */}
        <button
          onClick={() => navigate(`/profile/${user?.id}`)}
          className="ml-1 w-8 h-8 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-sm font-semibold hover:ring-2 hover:ring-teal-400 transition"
        >
          {user?.prenom?.[0] ?? 'U'}
        </button>
      </div>
    </header>
  )
}