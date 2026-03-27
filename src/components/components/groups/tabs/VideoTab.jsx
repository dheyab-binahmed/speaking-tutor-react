const VideoTab = ({ group, onLeave }) => (
  <div style={{ flex: 1, background: "#111827", display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, padding: 20, overflowY: "auto" }}>
      {["You", "Maria", "Carlos", "Ana"].map((name, i) => (
        <div key={i} style={{ background: "#1F2937", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color: "#fff" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
            <div style={{ fontSize: 13 }}>{name}</div>
          </div>
          <div style={{ padding: "9px 14px", background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", gap: 8 }}>
            <div className="ava" style={{ width: 26, height: 26, background: group.color, fontSize: 10 }}>{name.slice(0, 2).toUpperCase()}</div>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{name}{i === 0 ? " (You)" : ""}</span>
          </div>
        </div>
      ))}
    </div>
    <div style={{ padding: "12px 20px", background: "rgba(0,0,0,.7)", display: "flex", justifyContent: "center", gap: 12, flexShrink: 0 }}>
      {[["🎙️", false], ["📹", false], ["💻", false], ["📞", true]].map(([icon, isDanger], i) => (
        <button key={i} onClick={isDanger ? onLeave : undefined} style={{
          background: isDanger ? "#DC2626" : "rgba(255,255,255,.15)",
          border: "none", color: "#fff", width: 46, height: 46, borderRadius: "50%",
          cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
        }}>{icon}</button>
      ))}
    </div>
  </div>
);

export default VideoTab;
