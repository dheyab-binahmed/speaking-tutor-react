const ResourcesTab = ({ group, notify }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Study Resources</div>
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>Shared files & learning materials</div>
      </div>
      <button className="btn-coral" style={{ padding: "7px 14px", fontSize: 13 }} onClick={() => notify("Upload feature coming soon!", "info")}>📤 Upload</button>
    </div>
    <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
      {(group.resources || []).length === 0 ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📁</div>
          <div style={{ fontWeight: 600 }}>No resources yet</div>
          <div style={{ fontSize: 13 }}>Upload study materials to share</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14 }}>
          {group.resources.map((r, i) => (
            <div key={i} style={{ background: "#F8F7F3", border: "1px solid #E5E7EB", borderRadius: 12, padding: 16, cursor: "pointer" }}>
              <div style={{ fontSize: 30, marginBottom: 10 }}>{r.icon}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>{r.type}</div>
              <button className="btn-ghost" style={{ padding: "5px 11px", fontSize: 12 }}>⬇️ Download</button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ResourcesTab;
