import { useState } from "react";

const LANGUAGES = ["Spanish", "English", "French", "German", "Japanese", "Korean", "Chinese", "Arabic", "Portuguese", "Russian", "Italian"];

const CreateGroupModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({ name: "", description: "", language: "", level: "" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const valid = form.name && form.description && form.language && form.level;

  const handleSubmit = (e) => { e.preventDefault(); if (valid) { onCreate(form); onClose(); } };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 30, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", animation: "fadeInUp .3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Create Study Group</h2>
          <button onClick={onClose} style={{ background: "#F5F5F3", border: "none", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>Group Name</label>
            <input className="fc" type="text" placeholder="e.g. Spanish Conversation Club" value={form.name} onChange={set("name")} required />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>Description</label>
            <textarea className="fc" style={{ resize: "vertical", minHeight: 80 }} placeholder="Describe your group's purpose..." value={form.description} onChange={set("description")} required />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>Language</label>
            <select className="fc" value={form.language} onChange={set("language")} required style={{ appearance: "none" }}>
              <option value="">Choose a language</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#374151" }}>Proficiency Level</label>
            <select className="fc" value={form.level} onChange={set("level")} required style={{ appearance: "none" }}>
              <option value="">Select level</option>
              <option value="beginner">👶 Beginner (A1-A2)</option>
              <option value="intermediate">🎓 Intermediate (B1-B2)</option>
              <option value="advanced">🏆 Advanced (C1-C2)</option>
              <option value="all">🌈 All Levels Welcome</option>
            </select>
          </div>

          <button type="submit" className="btn-coral" disabled={!valid} style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 15, marginTop: 4 }}>
            🚀 Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
