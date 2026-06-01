import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { createResource } from '../../api/resources.api'

const TYPES = ['paper', 'notes', 'dataset']
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Life Sciences', 'Humanities', 'Economics']

export default function ResourceUploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ titre: '', description: '', type: 'notes', departement: '', tags: '' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.titre.trim()) return setError('Le titre est obligatoire')
    if (!file) return setError('Veuillez sélectionner un fichier')

    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('titre', form.titre)
      formData.append('description', form.description)
      formData.append('type', form.type)
      formData.append('departement', form.departement)
      // tags envoyé en JSON string comme attendu par le backend
      formData.append('tags', JSON.stringify(
        form.tags.split(',').map(t => t.trim()).filter(Boolean)
      ))
      formData.append('file', file)

      await createResource(formData)
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-bold text-[#0d1b2a]">Upload Resource</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 flex flex-col gap-3">
          <input
            value={form.titre}
            onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
            placeholder="Title *"
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400/50"
          />

          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description (optional)"
            rows={2}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none resize-none focus:ring-2 focus:ring-teal-400/50"
          />

          {/* Type */}
          <div className="flex gap-2">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition
                  ${form.type === t ? 'bg-[#0d1b2a] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Department */}
          <select
            value={form.departement}
            onChange={e => setForm(f => ({ ...f, departement: e.target.value }))}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400/50"
          >
            <option value="">Department (optional)</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          {/* Tags */}
          <input
            value={form.tags}
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            placeholder="Tags (séparés par virgule)"
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-400/50"
          />

          {/* File upload */}
          <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition
            ${file ? 'border-teal-400 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'}`}>
            <Upload size={20} className={file ? 'text-teal-500' : 'text-slate-400'} />
            <span className="text-xs text-slate-500 text-center">
              {file ? file.name : 'Cliquez pour sélectionner un fichier (PDF, DOCX, PPT)'}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-5 pt-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-sm font-medium rounded-xl hover:bg-slate-50 transition">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-xl hover:bg-teal-400 transition disabled:opacity-50"
          >
            {loading ? 'Upload...' : 'Publier'}
          </button>
        </div>
      </div>
    </div>
  )
}