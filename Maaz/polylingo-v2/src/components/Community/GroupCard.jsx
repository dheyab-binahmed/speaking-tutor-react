export default function GroupCard({ group, active, onSelect }) {
  return (
    <div className={`group-card ${active ? 'active' : ''}`} onClick={onSelect}>
      <img src={group.avatar || '/default-avatar.png'} alt={group.name} className="group-avatar" />
      <div>
        <h4>{group.name}</h4>
        <p>{group.members} members</p>
      </div>
    </div>
  )
}
