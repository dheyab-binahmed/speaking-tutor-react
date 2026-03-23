const ToastContainer = ({ toasts }) => (
  <div style={{ position: "fixed", top: 76, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
    {toasts.map((t) => (
      <div key={t.id} style={{
        background: "#fff", border: "1px solid #E5E7EB",
        borderLeft: `4px solid ${t.type === "success" ? "#059669" : t.type === "error" ? "#DC2626" : "#DC4C2A"}`,
        borderRadius: 12, padding: "11px 16px",
        boxShadow: "0 8px 24px rgba(0,0,0,.11)", maxWidth: 320,
        fontSize: 14, fontWeight: 500, color: "#1C1917",
        animation: "slideInRight .3s ease",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {t.message}
      </div>
    ))}
  </div>
);

export default ToastContainer;
