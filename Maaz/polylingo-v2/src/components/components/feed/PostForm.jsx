import { useState } from "react";

const PostForm = ({ onPost }) => {
  const [content, setContent] = useState("");
  const valid = content.trim().length >= 10;

  return (
    <div style={{ background: "#F8F7F3", border: "1.5px dashed #D1D5DB", borderRadius: 16, padding: 22, marginBottom: 22 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div className="ava" style={{ width: 38, height: 38, background: "#DC4C2A", fontSize: 13 }}>ME</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Share with the community</div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>Min. 10 characters</div>
        </div>
      </div>
      <textarea className="fc-area" rows={4} placeholder="Share your language learning journey, ask questions, or celebrate achievements... ✨"
        value={content} onChange={(e) => setContent(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[["📷", "Photo"], ["🏷️", "Tag"], ["📊", "Poll"]].map(([icon, label]) => (
            <button key={label} className="btn-ghost" style={{ padding: "5px 11px", fontSize: 13 }}>{icon} {label}</button>
          ))}
        </div>
        <button className="btn-coral" onClick={() => { if (valid) { onPost(content.trim()); setContent(""); } }} disabled={!valid}>
          ✈️ Post
        </button>
      </div>
    </div>
  );
};

export default PostForm;
