const PartnerCard = ({ partner, onConnect }) => {
  const tagColors = [
    { bg: "#FEE2D5", color: "#9A2E10" },
    { bg: "#DBEAFE", color: "#1E40AF" },
    { bg: "#EDE9FE", color: "#4C1D95" },
  ];
  return (
    <div className="card" style={{ padding: 22, textAlign: "center", transition: "all .25s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563EB"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(37,99,235,.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E7E5E0"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ position: "relative", display: "inline-block", marginBottom: 12 }}>
        <div className="ava" style={{ width: 68, height: 68, background: partner.color, fontSize: 20, margin: "0 auto" }}>{partner.initials}</div>
        {partner.online && (
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, background: "#10B981", border: "2.5px solid #fff", borderRadius: "50%" }} />
        )}
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{partner.name}</div>
      <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>
        🌍 {partner.country} · {partner.online ? "🟢 Online" : "⚫ Offline"}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 16 }}>
        {partner.languages.map((lang, i) => (
          <span key={i} style={{ ...tagColors[i % 3], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{lang}</span>
        ))}
      </div>
      <button className={partner.connected ? "btn-ghost" : "btn-coral"} style={{ width: "100%", justifyContent: "center", opacity: partner.connected ? .7 : 1 }}
        onClick={() => onConnect(partner.id)} disabled={partner.connected}>
        {partner.connected ? "✓ Connected" : "💬 Connect"}
      </button>
    </div>
  );
};

export default PartnerCard;
