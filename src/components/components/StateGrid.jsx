const StatsGrid = ({ postCount, groupCount }) => {
  const stats = [
    { icon: "👥", value: "5,248", label: "Active Learners",    sub: "+128 today" },
    { icon: "💬", value: postCount, label: "Total Posts",       sub: "+42 this week" },
    { icon: "🤝", value: "892",    label: "Language Partners", sub: "Active now: 156" },
    { icon: "🏆", value: groupCount, label: "Active Groups",   sub: "Join new groups" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
      {stats.map((s, i) => (
        <div key={i} className="card" style={{ padding: 22, transition: "all .25s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#DC4C2A"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(220,76,42,.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
          <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1C1917", marginBottom: 3 }}>{s.value}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 3 }}>{s.label}</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
