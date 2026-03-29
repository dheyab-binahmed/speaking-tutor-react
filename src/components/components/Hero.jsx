const Hero = ({ onCreateGroup, onFindPartners }) => (
  <div style={{
    background: "linear-gradient(140deg, #1C1917 0%, #2D2016 100%)",
    borderRadius: 24, padding: "56px 40px", textAlign: "center", color: "#fff",
    position: "relative", overflow: "hidden", marginBottom: 28,
  }}>
    {/* Decorative blobs */}
    <div style={{ position: "absolute", top: -70, right: -70, width: 280, height: 280, background: "#DC4C2A", borderRadius: "50%", opacity: .1, pointerEvents: "none" }} />
    <div style={{ position: "absolute", bottom: -80, left: -40, width: 220, height: 220, background: "#7C3AED", borderRadius: "50%", opacity: .09, pointerEvents: "none" }} />

    <div style={{ position: "relative", zIndex: 1 }}>
      <span style={{ display: "inline-block", background: "rgba(220,76,42,.2)", color: "#FCA89A", padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 18, border: "1px solid rgba(220,76,42,.3)" }}>
        🌍 PolyLingo Community
      </span>
      <h1 style={{ fontSize: 46, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.08, letterSpacing: "-1.5px" }}>
        Connect & Grow<br />
        <span style={{ color: "#DC4C2A" }}>Together</span>
      </h1>
      <p style={{ fontSize: 17, opacity: .72, maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.65 }}>
        Join thousands of language learners. Share insights, find partners, and accelerate your learning journey.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-coral" onClick={onCreateGroup} style={{ padding: "11px 24px", fontSize: 15 }}>＋ Create Group</button>
        <button onClick={onFindPartners} style={{
          background: "rgba(255,255,255,.13)", border: "1px solid rgba(255,255,255,.28)",
          color: "#fff", padding: "11px 24px", fontSize: 15, borderRadius: 10,
          cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all .2s",
        }}>🤝 Find Partners</button>
      </div>
    </div>
  </div>
);

export default Hero;
