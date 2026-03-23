import { useEffect, useState } from 'react'
import axios from 'axios'
import GroupDetail from './GroupDetail'
import GroupCard from './GroupCard'
import './Community.css'

const FALLBACK_GROUPS = [
  { id: 1, name: 'Spanish Conversation Club', members: '2.4k', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80', description: 'Daily live speaking practice sessions.' },
  { id: 2, name: 'Japanese for Beginners', members: '1.8k', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80', description: 'Start your Japanese journey with peers.' },
  { id: 3, name: 'Advanced French Grammar', members: '956', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', description: 'Deep grammar discussions and tips.' },
]

export default function Community() {
  const [groups, setGroups] = useState(FALLBACK_GROUPS)
  const [selectedGroup, setSelectedGroup] = useState(FALLBACK_GROUPS[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/groups')
        if (Array.isArray(response?.data) && response.data.length > 0) {
          setGroups(response.data)
          setSelectedGroup(response.data[0])
        } else {
          setGroups(FALLBACK_GROUPS)
          setSelectedGroup(FALLBACK_GROUPS[0])
        }
      } catch {
        setError('Could not load groups from server. Using local groups.')
        setGroups(FALLBACK_GROUPS)
        setSelectedGroup(FALLBACK_GROUPS[0])
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) return <p className="loading">Loading Community...</p>

  return (
    <div className="community-container">
      {error && <p className="error">{error}</p>}
      <aside className="sidebar">
        <h2>Groups</h2>
        {groups.length === 0 ? (
          <p>No groups available yet.</p>
        ) : (
          groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              active={selectedGroup?.id === group.id}
              onSelect={() => setSelectedGroup(group)}
            />
          ))
        )}
      </aside>
      <main className="group-content">
        {selectedGroup ? <GroupDetail group={selectedGroup} /> : <p>Select a group to view posts</p>}
      </main>
    </div>
  )
}
