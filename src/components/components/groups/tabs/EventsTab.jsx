const EventsTab = ({ group, notify }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <div style={{ padding: "14px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Upcoming Events</div>
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>Practice sessions & meetings</div>
      </div>
      <button className="btn-coral" style={{ padding: "7px 14px", fontSize: 13 }} onClick={() => notify("Event creation coming soon!", "info")}>➕ Create Event</button>
    </div>
    <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
      {(group.events || []).length === 0 ? (
        <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
          <div style={{ fontWeight: 600 }}>No events yet</div>
          <div style={{ fontSize: 13 }}>Create an event to practice together</div>
        </div>
      ) : (
        group.events.map((ev, i) => (
          <div key={i} style={{ background: "#F8F7F3", borderLeft: `4px solid ${group.color}`, borderRadius: "0 12px 12px 0", padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>{ev.date}</div>
            <div style={{ background: group.color, color: "#fff", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "inline-block", marginBottom: 8 }}>{ev.time}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{ev.title}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>👥 {ev.participants} participants</span>
              <button className="btn-coral" style={{ padding: "6px 14px", fontSize: 12 }}>Join</button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default EventsTab;
