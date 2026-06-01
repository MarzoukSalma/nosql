import { useState } from 'react'
import { Heart, MessageCircle, Share2, Trash2, FileText, ExternalLink } from 'lucide-react'
import { toggleLike, deletePost, getComments, addComment } from '../../api/feed.api'

const timeAgo = (date) => {
  const h = Math.floor((Date.now() - new Date(date)) / 3600000)
  if (h < 1) return "À l'instant"
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}j ago`
}

// ✅ Convertir le format Neo4j integer { low, high } en nombre JS
const toNumber = (val) => {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (typeof val === 'object' && 'low' in val) return val.low
  return Number(val)
}

export default function PostCard({ post, onUpdate }) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments]         = useState([])
  const [newComment, setNewComment]     = useState('')
  const [loadingCmt, setLoadingCmt]     = useState(false)
  const [liked, setLiked]               = useState(post.isLiked)
  const [likesCount, setLikesCount]     = useState(toNumber(post.likes))

  const currentUserId = localStorage.getItem('userId')
  const auteur = post.auteur ?? {}
  const isOwner = String(auteur.id) === String(currentUserId)

  const handleLike = async () => {
    setLiked(prev => !prev)
    setLikesCount(c => liked ? c - 1 : c + 1)
    try {
      await toggleLike(post.id)
    } catch {
      setLiked(prev => !prev)
      setLikesCount(c => liked ? c + 1 : c - 1)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer ce post ?')) return
    try {
      await deletePost(post.id)
      onUpdate()
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingCmt(true)
      try {
        const res = await getComments(post.id)
        setComments(res.data.data ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingCmt(false)
      }
    }
    setShowComments(prev => !prev)
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      await addComment(post.id, newComment)
      const res = await getComments(post.id)
      setComments(res.data.data ?? [])
      setNewComment('')
    } catch (err) {
      console.error(err)
    }
  }

  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0d1b2a] flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden">
            {auteur.avatar
              ? <img src={`${apiUrl}${auteur.avatar}`} className="w-full h-full object-cover" alt="" />
              : (auteur.prenom?.[0] ?? 'U')
            }
          </div>
          <div>
            <p className="font-semibold text-[#0d1b2a] text-sm">
              {auteur.prenom} {auteur.nom}
            </p>
            <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Contenu */}
      <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.contenu}</p>

      {/* ✅ Image */}
      {post.mediaUrl && post.type === 'image' && (
        <img
          src={`${apiUrl}${post.mediaUrl}`}
          alt="media"
          className="w-full rounded-xl mb-4 max-h-80 object-cover"
        />
      )}

      {/* ✅ Fichier */}
      {post.mediaUrl && post.type === 'fichier' && (
        <a
          href={`${apiUrl}${post.mediaUrl}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg mb-4 hover:bg-slate-100 transition"
        >
          <FileText size={15} className="text-teal-600 shrink-0" />
          <span className="text-xs text-slate-600 flex-1 truncate">
            {post.mediaUrl.split('/').pop()}
          </span>
          <ExternalLink size={13} className="text-slate-400" />
        </a>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-3 border-t border-slate-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition ${liked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
          {likesCount}
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition"
        >
          <MessageCircle size={17} />
        </button>

        <button className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition ml-auto">
          <Share2 size={17} />
        </button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {loadingCmt ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-xs text-slate-400 text-center">Aucun commentaire</p>
          ) : comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0">
                {c.auteur?.prenom?.[0] ?? 'U'}
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                <p className="text-xs font-semibold text-[#0d1b2a]">
                  {c.auteur?.prenom} {c.auteur?.nom}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{c.contenu}</p>
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Ajouter un commentaire..."
              className="flex-1 text-xs bg-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-teal-400/50"
            />
            <button
              onClick={handleAddComment}
              className="px-3 py-1.5 bg-[#0d1b2a] text-white text-xs rounded-full hover:bg-[#1a2f45] transition"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}