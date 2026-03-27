import { useState, useRef, useEffect } from "react";

const ChatTab = ({ group, notify }) => {
  const [msgs, setMsgs] = useState(group.messages || []);
  const [val, setVal] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!val.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMsgs((p) => [...p, { id: Date.now(), sender: "You", initials: "ME", text: val.trim(), time: now, sent: true }]);
    setVal("");
    const replies = ["¡Excelente!", "Great point!", "Let's practice together!", "I agree! 🙌"];
    setTimeout(() => setMsgs((p) => [...p, { id: Date.now() + 1, sender: "Bot", initials: "GB", text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), sent: false }]), 1000);
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 210, borderRight: "1px solid #E5E7EB", background: "#F8F7F3", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", fontWeight: 700, fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", borderBottom: "1px solid #E5E7EB" }}>Members</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
          {(group.membersList || []).map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 10, cursor: "pointer" }}>
              <div style={{ position: "relative" }}>
                <div className="ava" style={{ width: 30, height: 30, background: group.color, fontSize: 11 }}>{m.initials}</div>
                {m.status === "online" && <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, background: "#10B981", border: "2px solid #F8F7F3", borderRadius: "50%" }} />}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1C1917" }}>{m.name}</div>
                <div style={{ fontSize: 11, color: m.status === "online" ? "#10B981" : "#9CA3AF" }}>{m.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="chat-msgs">
          {msgs.length === 0 ? (
            <div style={{ textAlign: "center", color: "#9CA3AF", padding: "40px 20px" }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>💬</div>
              <div style={{ fontWeight: 600 }}>No messages yet</div>
              <div style={{ fontSize: 13 }}>Start the conversation!</div>
            </div>
          ) : msgs.map((msg) => (
            <div key={msg.id} style={{ display: "flex", flexDirection: msg.sent ? "row-reverse" : "row", gap: 9, marginBottom: 14, alignItems: "flex-end" }}>
              <div className="ava" style={{ width: 28, height: 28, background: msg.sent ? "#DC4C2A" : group.color, fontSize: 10, flexShrink: 0 }}>{msg.initials}</div>
              <div style={{ maxWidth: "65%" }}>
                {!msg.sent && <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 3 }}>{msg.sender}</div>}
                <div style={{
                  background: msg.sent ? "#DC4C2A" : "#F5F5F3", color: msg.sent ? "#fff" : "#1C1917",
                  borderRadius: msg.sent ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "9px 13px", fontSize: 14, lineHeight: 1.5,
                }}>{msg.text}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3, textAlign: msg.sent ? "right" : "left" }}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "11px 16px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 9, alignItems: "flex-end", background: "#fff", flexShrink: 0 }}>
          <textarea className="chat-fc" rows={1} placeholder="Type a message..." value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            style={{ resize: "none" }} />
          <button className="btn-coral" onClick={send} style={{ padding: "8px 15px", flexShrink: 0 }}>✈️</button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
