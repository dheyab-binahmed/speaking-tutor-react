import { useEffect, useState } from 'react'
import axios from 'axios'
import PostCard from './PostCard'

const FALLBACK_POSTS = [
  { id: 1, userAvatar: '', userName: 'Maria J.', content: 'Today I practiced pronunciation and improved my accent!' },
  { id: 2, userAvatar: '', userName: 'Takashi K.', content: 'I read a new article and learned 15 vocabulary words.' },
]

export default function GroupDetail({ group }) {
  const [posts, setPosts] = useState(FALLBACK_POSTS)
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!group?.id) {
      setPosts(FALLBACK_POSTS)
      setLoading(false)
      return
    }

    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/groups/${group.id}/posts`)
        if (Array.isArray(response?.data)) {
          setPosts(response.data)
        } else {
          setPosts(FALLBACK_POSTS)
        }
      } catch {
        setPosts(FALLBACK_POSTS)
        setError('Could not load posts from server. Showing local posts.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [group])

  const handleAddPost = async () => {
    if (!newPost.trim()) return

    const newEntry = { id: Date.now(), userAvatar: '', userName: 'You', content: newPost.trim() }
    try {
      const response = await axios.post(`/api/groups/${group.id}/posts`, { content: newPost.trim() })
      if (response?.data?.id) {
        setPosts((prev) => [response.data, ...prev])
      } else {
        setPosts((prev) => [newEntry, ...prev])
      }
      setNewPost('')
    } catch {
      setPosts((prev) => [newEntry, ...prev])
      setNewPost('')
    }
  }

  const handleJoinGroup = async () => {
    try {
      await axios.post(`/api/groups/${group.id}/join`)
      setJoined(true)
    } catch {
      setJoined(true)
    }
  }

  if (loading) return <p className="loading">Loading posts...</p>

  return (
    <div className="group-detail">
      {error && <p className="error">{error}</p>}
      <div className="group-header">
        <div>
          <h3>{group?.name || 'Unknown Group'}</h3>
          <p>{group?.description || 'No description yet.'}</p>
        </div>
        <button onClick={handleJoinGroup} disabled={joined}>{joined ? 'Joined' : 'Join Group'}</button>
      </div>

      {joined && (
        <div className="new-post">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a post..."
            aria-label="Write a post"
          />
          <button onClick={handleAddPost}>Post</button>
        </div>
      )}

      <div className="posts-list">
        {posts.length === 0 ? <p>No posts yet. Be the first!</p> : posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}
