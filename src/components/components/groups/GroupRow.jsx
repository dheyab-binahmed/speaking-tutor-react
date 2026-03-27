const LEVEL_LABELS = { beginner: "👶 Beginner", intermediate: "🎓 Intermediate", advanced: "🏆 Advanced", all: "🌈 All Levels" };

const GroupRow = ({ group, onOpen }) => (
  <div className="card" style={{ padding: 22, display: "flex", alignItems: "center", gap: 18, transition: "all .25s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#DC4C2A"; e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,76,42,.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
    <div style={{ width: 56, height: 56, borderRadius: 14, background: group.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
      {group.icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{group.name}</div>
      <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 10, lineHeight: 1.5 }}>{group.description}</div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
        <span className="tag tag-blue">{group.language}</span>
        <span className="tag tag-green">{LEVEL_LABELS[group.level] || group.level}</span>
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>👥 {group.members} members</span>
      </div>
    </div>
    <button className="btn-coral" onClick={() => onOpen(group.id)} style={{ flexShrink: 0 }}>Open →</button>
  </div>
);

export default GroupRow;
