import { useState, useRef } from 'react'
import { Image, Database, X, FileText } from 'lucide-react'
import { createPost } from '../../api/feed.api'

export default function CreatePostBox({ onPostCreated }) {
  const [contenu, setContenu] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  // Récupérer l'utilisateur stocké par le binôme (auth)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) setFile(selected)
  }

  const removeFile = () => {
    setFile(null)
    fileRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!contenu.trim() && !file) return
    setLoading(true)
    try {
      // FormData obligatoire car on peut avoir un fichier
      const formData = new FormData()
      formData.append('contenu', contenu)
      if (file) formData.append('media', file)

      await createPost(formData)
      setContenu('')
      setFile(null)
      onPostCreated()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white font-semibold shrink-0">
          {user?.prenom?.[0] ?? 'U'}
        </div>

        <div className="flex-1">
          <textarea
            value={contenu}
            onChange={e => setContenu(e.target.value)}
            placeholder="Share your latest research findings..."
            rows={2}
            className="w-full resize-none text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />

          {/* Aperçu du fichier sélectionné */}
          {file && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <FileText size={14} className="text-teal-600 shrink-0" />
              <span className="text-xs text-slate-600 truncate flex-1">{file.name}</span>
              <button onClick={removeFile} className="text-slate-400 hover:text-red-500 transition">
                <X size={13} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <div className="flex gap-3">
              {/* Input caché pour les images */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition cursor-pointer"
              >
                <Image size={15} /> Media
              </label>

              {/* Input caché pour les datasets/fichiers */}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
                id="dataset-upload"
              />
              <label
                htmlFor="dataset-upload"
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-600 transition cursor-pointer"
              >
                <Database size={15} /> Dataset
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || (!contenu.trim() && !file)}
              className="px-4 py-1.5 bg-[#0d1b2a] text-white text-xs font-semibold rounded-lg hover:bg-[#1a2f45] transition disabled:opacity-40"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}