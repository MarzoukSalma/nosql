import { useState, useEffect } from 'react'
import { getFeed } from '../../api/feed.api'
import CreatePostBox from '../../components/feed/CreatePostBox'
import PostCard from '../../components/feed/PostCard'
import FeedRightSidebar from '../../components/feed/FeedRightSidebar'

export default function FeedPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = async () => {
    setLoading(true)
    try {
      const res = await getFeed()
      // backend retourne { success: true, data: [...] }
      setPosts(res.data.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPosts() }, [])

  return (
    <div className="flex gap-6 max-w-6xl mx-auto px-6 py-6 h-full">
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <CreatePostBox onPostCreated={loadPosts} />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Aucun post pour le moment</div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onUpdate={loadPosts} />
          ))
        )}
      </div>

      <FeedRightSidebar />
    </div>
  )
}