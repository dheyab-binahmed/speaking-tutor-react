import { useState } from 'react'

const initialPosts = [
  { id: 1, initials: 'MJ', author: 'Maria Johnson', time: '2 hours ago', language: 'Spanish', content: "Just completed my 30-day speaking streak! 🎉 I practiced Spanish for at least 15 minutes every day.", likes: 42, comments: 8, shares: 3, liked: true },
  { id: 2, initials: 'TK', author: 'Takashi Kimura', time: '5 hours ago', language: 'English', content: "Can someone explain the difference between 'make' and 'do'?", likes: 18, comments: 12, shares: 1, liked: false },
  { id: 3, initials: 'SL', author: 'Sarah Lee', time: 'Yesterday', language: 'French', content: 'Reached B2 level in French after 6 months!', likes: 95, comments: 23, shares: 12, liked: false }
]

const partners = [
  { id: 1, initials: 'AM', name: 'Ana Martinez', country: '🇪🇸 Spain', teaches: 'Spanish', learns: 'English' },
  { id: 2, initials: 'HT', name: 'Hiroshi Tanaka', country: '🇯🇵 Japan', teaches: 'Japanese', learns: 'French' },
  { id: 3, initials: 'EV', name: 'Emma Volkova', country: '🇷🇺 Russia', teaches: 'Russian', learns: 'Spanish' },
  { id: 4, initials: 'KM', name: 'Kim Minjun', country: '🇰🇷 Korea', teaches: 'Korean', learns: 'English' }
]

const groups = [
  { id: 1, icon: 'fa-comments', name: 'Spanish Conversation Club', desc: 'Weekly conversation practice', language: 'Spanish', level: 'Intermediate', members: '2.4k' },
  { id: 2, icon: 'fa-book', name: 'Japanese for Beginners', desc: 'Learn hiragana and simple sentences', language: 'Japanese', level: 'Beginner', members: '1.8k' },
  { id: 3, icon: 'fa-graduation-cap', name: 'Advanced French Grammar', desc: 'Deep grammar sessions', language: 'French', level: 'Advanced', members: '956' }
]

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts)
  const [postText, setPostText] = useState('')
  const [showGroupForm, setShowGroupForm] = useState(false)
  const [groupDraft, setGroupDraft] = useState({ name: '', desc: '', language: '', level: 'Beginner' })

  function handlePost() {
    if (postText.trim().length < 10) {
      alert('Please write at least 10 characters.')
      return
    }
    setPosts((prev) => [{ id: Date.now(), initials: 'ME', author: 'You', time: 'Just now', language: 'English', content: postText.trim(), likes: 0, comments: 0, shares: 0, liked: false }, ...prev])
    setPostText('')
  }

  function toggleLike(id) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)))
  }

  function saveGroup(e) {
    e.preventDefault()
    if (!groupDraft.name.trim() || !groupDraft.desc.trim() || !groupDraft.language.trim()) {
      alert('Please fill out all fields.')
      return
    }
    groups.unshift({ id: Date.now(), icon: 'fa-users', name: groupDraft.name, desc: groupDraft.desc, language: groupDraft.language, level: groupDraft.level, members: '1.2k' })
    setGroupDraft({ name: '', desc: '', language: '', level: 'Beginner' })
    setShowGroupForm(false)
    alert('Group created (demo)')
  }

  return (
    <div id="community-page">
      <div className="container">
        <div className="community-header">
          <h1>Connect & Grow Together</h1>
          <p>Join thousands of learners in our vibrant community.</p>
          <div className="community-header-actions">
            <button className="btn btn-primary" onClick={() => setShowGroupForm((s) => !s)}>Create Group</button>
            <button className="btn btn-outline">Find Partners</button>
          </div>
        </div>

        {showGroupForm && (
          <form className="group-form" onSubmit={saveGroup}>
            <div className="group-form-row">
              <input value={groupDraft.name} onChange={(e) => setGroupDraft((s) => ({ ...s, name: e.target.value }))} placeholder="Group name" required />
              <input value={groupDraft.language} onChange={(e) => setGroupDraft((s) => ({ ...s, language: e.target.value }))} placeholder="Language" required />
            </div>
            <div className="group-form-row">
              <select value={groupDraft.level} onChange={(e) => setGroupDraft((s) => ({ ...s, level: e.target.value }))}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input value={groupDraft.desc} onChange={(e) => setGroupDraft((s) => ({ ...s, desc: e.target.value }))} placeholder="Description" required />
            </div>
            <div style={{ textAlign: 'right' }}><button className="btn btn-primary" type="submit">Save Group</button></div>
          </form>
        )}

        <div className="community-feed">
          <div className="section-header"><h2>Community Feed</h2><button className="btn btn-outline">Refresh</button></div>
          <div className="post-form">
            <textarea className="post-input" value={postText} onChange={(e) => setPostText(e.target.value)} placeholder="Share your thoughts..." />
            <div className="post-actions-row"><button className="btn btn-primary" onClick={handlePost}>Post</button></div>
          </div>
          <ul className="community-list">
            {posts.map((p) => (
              <li key={p.id}>
                <div className="post-header">
                  <div className="post-avatar">{p.initials}</div>
                  <div>
                    <div className="post-author">{p.author}</div>
                    <div className="post-meta">{p.time} · {p.language}</div>
                  </div>
                </div>
                <div className="post-content">{p.content}</div>
                <div className="post-actions-bar">
                  <button className={`post-action-btn${p.liked ? ' liked' : ''}`} onClick={() => toggleLike(p.id)}>♥ {p.likes}</button>
                  <button className="post-action-btn">💬 {p.comments}</button>
                  <button className="post-action-btn">↗ {p.shares}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="language-partners">
          <div className="section-header"><h2>Language Partners</h2><button className="btn btn-secondary">Refresh</button></div>
          <ul className="community-list">
            {partners.map((p) => (
              <li key={p.id}>
                <div className="list-left"><div className="partner-avatar">{p.initials}</div><div><div className="list-label">{p.name}</div><div className="list-note">{p.country} · {p.teaches} → {p.learns}</div></div></div>
                <button className="list-action">Connect</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="study-groups">
          <div className="section-header"><h2>Study Groups</h2></div>
          <ul className="community-list">
            {groups.map((g) => (
              <li key={g.id}>
                <div className="list-left"><div className="group-icon"><i className={`fas ${g.icon}`} /></div><div><div className="list-label">{g.name}</div><div className="list-note">{g.desc}</div></div></div>
                <div><div className="list-note">{g.language} · {g.level}</div><button className="list-action">Join</button></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
