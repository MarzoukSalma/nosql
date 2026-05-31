import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Share2, BookOpen, MessageSquare, User, Plus } from 'lucide-react'

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const navigate = useNavigate()

  const navItems = [
    { to: '/feed',     icon: <LayoutDashboard size={18} />, label: 'Feed' },
    { to: '/network',  icon: <Share2 size={18} />,          label: 'Network' },
    { to: '/library',  icon: <BookOpen size={18} />,        label: 'Library' },
    { to: '/messages', icon: <MessageSquare size={18} />,   label: 'Messages' },
    { to: `/profile/${user?.id}`, icon: <User size={18} />, label: 'Profile' },
  ]

  return (
    <aside className="w-60 h-full bg-white border-r border-slate-200 flex flex-col py-6 px-4 shrink-0">
      {/* App name */}
      <div className="mb-10 px-2">
        <span className="font-bold text-xl text-[#0d1b2a]">ScholarGraph</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isActive ? 'bg-[#0d1b2a] text-white' : 'text-slate-600 hover:bg-slate-100'}`
            }>
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Create Post */}
      <button
        onClick={() => navigate('/feed')}
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#0d1b2a] text-white font-semibold text-sm hover:bg-[#1a2f45] transition"
      >
        <Plus size={16} /> Create Post
      </button>
    </aside>
  )
}