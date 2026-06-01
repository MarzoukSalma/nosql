import { useState, useEffect } from 'react'
import { getResources } from '../../api/resources.api'
import ResourceCard from '../../components/resources/ResourceCard'
import ResourceUploadModal from '../../components/resources/ResourceUploadModal'
import ResourcesSidebar from '../../components/resources/ResourcesSidebar'
import { Search, LayoutGrid, List } from 'lucide-react'

const toNumber = (val) => {
  if (!val) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'object' && 'low' in val) return val.low
  return Number(val)
}

const TYPES = ['Tous', 'paper', 'notes', 'dataset']
const DEPARTMENTS = ['Tous', 'Computer Science', 'Mathematics', 'Life Sciences', 'Humanities', 'Economics']

export default function LibraryPage() {
  const [resources, setResources]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('Tous')
  const [deptFilter, setDeptFilter]   = useState('Tous')
  const [viewMode, setViewMode]       = useState('grid') // grid | list
  const [showUpload, setShowUpload]   = useState(false)

  const loadResources = async () => {
    setLoading(true)
    try {
      const params = {}
      if (search)                  params.search      = search
      if (typeFilter !== 'Tous')   params.type        = typeFilter
      if (deptFilter !== 'Tous')   params.departement = deptFilter

      const res = await getResources(params)
      setResources(res.data.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Recharger quand les filtres changent
  useEffect(() => {
    const timeout = setTimeout(loadResources, 300) // debounce search
    return () => clearTimeout(timeout)
  }, [search, typeFilter, deptFilter])

  return (
    <div className="flex gap-6 max-w-6xl mx-auto px-6 py-6">

      {/* Main */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0d1b2a]">Resource Library</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-xl hover:bg-teal-400 transition"
          >
            + Upload Resource
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources, topics, or authors..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400/50"
          />
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition
                  ${typeFilter === t
                    ? 'bg-[#0d1b2a] text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-teal-400'
                  }`}
              >
                {t === 'Tous' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* View mode */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-slate-100 text-[#0d1b2a]' : 'text-slate-400'}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-slate-100 text-[#0d1b2a]' : 'text-slate-400'}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Aucune ressource trouvée</div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-2 gap-4'
            : 'flex flex-col gap-3'
          }>
            {resources.map(r => (
              <ResourceCard
                key={r.id}
                resource={r}
                viewMode={viewMode}
                onUpdate={loadResources}
                toNumber={toNumber}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <ResourcesSidebar
        deptFilter={deptFilter}
        setDeptFilter={setDeptFilter}
        departments={DEPARTMENTS}
        onRequestResource={() => setShowUpload(true)}
      />

      {/* Upload Modal */}
      {showUpload && (
        <ResourceUploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); loadResources() }}
        />
      )}
    </div>
  )
}