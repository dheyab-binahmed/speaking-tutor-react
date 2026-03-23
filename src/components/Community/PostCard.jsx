export default function PostCard({ post }) {
  return (
    <div className="post-card">
      <div className="post-user">
        <img src={post.userAvatar || '/default-avatar.png'} alt={post.userName} className="post-avatar" />
        <strong>{post.userName}</strong>
      </div>
      <p className="post-content">{post.content}</p>
    </div>
  )
}
