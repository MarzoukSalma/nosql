import { useState } from 'react'
import { FileText, BookOpen, Database, Bookmark, Download, Trash2, ExternalLink } from 'lucide-react'
import { toggleSave, incrementDownload, deleteResource } from '../../api/resources.api'

const TYPE_ICONS = {
  paper:   BookOpen,
  notes:   FileText,
  dataset: Database,
}

const TYPE_COLORS = {
  paper:   'text-blue-500 bg-blue-50',
  notes:   'text-teal-600 bg-teal-50',
  dataset: 'text-purple-500 bg-purple-50',
}

export default function ResourceCard({ resource, viewMode, onUpdate, toNumber }) {
  const [saved, setSaved]     = useState(resource.isSaved ?? false)
  const [saving, setSaving]   = useState(false)

  const currentUserId = localStorage.getItem('userId')
  const isOwner = String(resource.auteur?.id) === String(currentUserId)

  const Icon = TYPE_ICONS[resource.type] ?? FileText
  const colorClass = TYPE_COLORS[resource.type] ?? 'text-slate-500 bg-slate-50'
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
  const tags = (() => { try { return JSON.parse(resource.tags ?? '[]') } catch { return [] } })()

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await toggleSave(resource.id)
      setSaved(prev => !prev)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = async () => {
    try {
      await incrementDownload(resource.id)
      window.open(`${apiUrl}${resource.fileUrl}`, '_blank')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer cette ressource ?')) return
    try {
      await deleteResource(resource.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
        <div className={`p-2.5 rounded-lg shrink-0 ${colorClass}`}>
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
              #{resource.type}
            </span>
            {resource.departement && (
              <span className="text-xs text-slate-400">{resource.departement}</span>
            )}
          </div>
          <p className="font-semibold text-sm text-[#0d1b2a] truncate">{resource.titre}</p>
          <p className="text-xs text-slate-400 truncate">
            {resource.auteur?.prenom} {resource.auteur?.nom}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400">{toNumber(resource.downloads)} downloads</span>

          <button onClick={handleSave} disabled={saving}
            className={`p-1.5 rounded-lg transition ${saved ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'}`}>
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>

          <button onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0d1b2a] hover:bg-slate-100 transition">
            <Download size={15} />
          </button>

          {isOwner && (
            <button onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`p-1.5 rounded-lg transition ${saved ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-teal-600 hover:bg-teal-50'}`}>
          <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
          #{resource.type}
        </span>
        <h3 className="font-semibold text-sm text-[#0d1b2a] mt-2 leading-snug">{resource.titre}</h3>
        {resource.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{resource.description}</p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white text-xs shrink-0">
            {resource.auteur?.prenom?.[0] ?? 'U'}
          </div>
          <span className="text-xs text-slate-400 truncate max-w-[80px]">
            {resource.auteur?.prenom} {resource.auteur?.nom}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isOwner && (
            <button onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0d1b2a] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2f45] transition">
            <ExternalLink size={12} /> Open
          </button>
        </div>
      </div>
    </div>
  )
}