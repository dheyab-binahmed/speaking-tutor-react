const Section = ({ title, action, children }) => (
  <div style={{ background: "#fff", border: "1px solid #E7E5E0", borderRadius: 20, padding: 26, marginBottom: 26 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, paddingBottom: 16, borderBottom: "1px solid #F3F4F6" }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1C1917" }}>{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

export default Section;
