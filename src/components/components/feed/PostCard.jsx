const PostCard = ({ post, onLike, onShare, onComment }) => (
  <div className="card fade-in-up" style={{ padding: 22, marginBottom: 14 }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 13, marginBottom: 14 }}>
      <div className="ava" style={{ width: 46, height: 46, background: post.color, fontSize: 15 }}>{post.initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{post.author}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>{post.time}</span>
          <span className="tag tag-green">📚 {post.language}</span>
        </div>
      </div>
    </div>
    <p style={{ fontSize: 15, lineHeight: 1.72, color: "#374151", whiteSpace: "pre-line", marginBottom: 14 }}>{post.content}</p>
    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 10, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
      <button className={`pact ${post.liked ? "liked" : ""}`} onClick={() => onLike(post.id)}>{post.liked ? "❤️" : "🤍"} {post.likes}</button>
      <button className="pact" onClick={() => onComment(post.id)}>💬 {post.comments}</button>
      <button className="pact" onClick={() => onShare(post.id)}>📤 {post.shares}</button>
      <span style={{ marginLeft: "auto", fontSize: 12, color: "#9CA3AF" }}>👁 {Math.floor(post.likes * 2.5)}</span>
    </div>
  </div>
);

export default PostCard;
