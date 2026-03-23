import { useState } from "react";
import ChatTab      from "./tabs/ChatTab";
import VideoTab     from "./tabs/VideoTab";
import ResourcesTab from "./tabs/ResourcesTab";
import EventsTab    from "./tabs/EventsTab";

const TABS = [
  { id: "chat",      icon: "💬", label: "Chat" },
  { id: "video",     icon: "📹", label: "Video Room" },
  { id: "resources", icon: "📁", label: "Resources" },
  { id: "events",    icon: "📅", label: "Events" },
];

const GroupInterface = ({ group, onClose, notify }) => {
  const [tab, setTab] = useState("chat");

  return (
    <div className="gi-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gi-box">
        {/* Header */}
        <div style={{ background: group.color, padding: "15px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, background: "rgba(255,255,255,.2)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{group.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>{group.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)" }}>{group.members} members · {group.language}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.2)", border: "none", width: 34, height: 34, borderRadius: "50%", color: "#fff", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", background: "#fff", flexShrink: 0, overflowX: "auto" }}>
          {TABS.map((t) => (
            <button key={t.id} className={`gtab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {tab === "chat"      && <ChatTab      group={group} notify={notify} />}
          {tab === "video"     && <VideoTab     group={group} onLeave={() => { setTab("chat"); notify("You left the call", "info"); }} />}
          {tab === "resources" && <ResourcesTab group={group} notify={notify} />}
          {tab === "events"    && <EventsTab    group={group} notify={notify} />}
        </div>
      </div>
    </div>
  );
};

export default GroupInterface;
