import { useState, useCallback, useEffect } from "react";

// ── Styles (community-scoped) ──────────────────────────────────────────────
import CommunityStyles from "../styles/CommunityStyles";

// ── UI utilities ──────────────────────────────────────────────────────────
import ToastContainer from "../components/components/ui/ToastContainer";
import Section from "../components/components/ui/Section";

// ── Community sections ────────────────────────────────────────────────────
import Hero from "../components/components/Hero";
import StateGrid from "../components/components/StateGrid";

// ── Feed ──────────────────────────────────────────────────────────────────
import PostForm from "../components/components/feed/PostForm";
import PostCard from "../components/components/feed/PostCard";

// ── Partners ──────────────────────────────────────────────────────────────
import PartnerCard from "../components/components/partners/PartnerCard";

// ── Groups ────────────────────────────────────────────────────────────────
import GroupRow from "../components/components/groups/GroupRow";
import CreateGroupModel from "../components/components/groups/CreateGroupModel";
import GroupInterface from "../components/components/groups/GroupInterface";

// ─────────────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch community data from backend
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // TODO: Fetch from backend API endpoints
        // const postsData = await CommunityService.getPosts();
        // const groupsData = await CommunityService.getGroups();
        // const partnersData = await CommunityService.getPartners();
        // setPosts(postsData);
        // setGroups(groupsData);
        // setPartners(partnersData);

        // For now, initialize as empty - backend integration coming soon
        setPosts([]);
        setGroups([]);
        setPartners([]);
      } catch (err) {
        console.error("Error fetching community data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunityData();
  }, []);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const notify = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  // ── Post handlers ─────────────────────────────────────────────────────────
  const handlePost = (content) => {
    const user = { name: "You", initials: "ME", color: "#059669" };
    setPosts((p) => [
      {
        id: Date.now(),
        author: user.name,
        initials: user.initials,
        time: "Just now",
        language: "Multiple",
        color: "#DC4C2A",
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        content,
      },
      ...p,
    ]);
    notify("Post published! 🎉", "success");
  };

  const handleLike = (id) =>
    setPosts((p) =>
      p.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );

  const handleShare = (id) => {
    setPosts((p) =>
      p.map((post) =>
        post.id === id ? { ...post, shares: post.shares + 1 } : post,
      ),
    );
    notify("Post shared! 📢", "success");
  };

  // ── Partner handler ───────────────────────────────────────────────────────
  const handleConnect = (id) => {
    const partner = partners.find((p) => p.id === id);
    setPartners((p) =>
      p.map((pt) => (pt.id === id ? { ...pt, connected: true } : pt)),
    );
    notify(`Request sent to ${partner?.name}! 📨`, "success");
  };

  // ── Group handlers ────────────────────────────────────────────────────────
  const handleCreateGroup = (form) => {
    const icons = {
      Spanish: "💬",
      English: "🎙️",
      French: "📖",
      Japanese: "📚",
      Korean: "🎌",
      Chinese: "🏮",
      Arabic: "🌙",
      German: "🏰",
      Portuguese: "🎵",
      Russian: "❄️",
      Italian: "🍕",
    };
    const colors = ["#DC4C2A", "#2563EB", "#7C3AED", "#059669", "#D97706"];
    setGroups((p) => [
      {
        id: Date.now(),
        name: form.name,
        icon: icons[form.language] || "👥",
        description: form.description,
        members: 1,
        language: form.language,
        level: form.level,
        color: colors[Math.floor(Math.random() * colors.length)],
        messages: [],
        membersList: [{ name: "You", initials: "ME", status: "online" }],
        resources: [],
        events: [],
      },
      ...p,
    ]);
    notify(`"${form.name}" created! 🎉`, "success");
  };

  const openGroup = (id) =>
    setActiveGroup(groups.find((g) => g.id === id) || null);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="plg-root">
      <CommunityStyles />
      <ToastContainer toasts={toasts} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {/* Hero */}
        <Hero
          onCreateGroup={() => setShowCreateGroup(true)}
          onFindPartners={() => notify("Searching for partners... 🤝", "info")}
        />

        {/* Stats */}
        <StateGrid postCount={posts.length} groupCount={groups.length} />

        {/* Loading State */}
        {loading && (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}
          >
            <p>Loading community data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && groups.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}
          >
            <p>
              Community features are coming soon! Start practicing to earn
              achievements.
            </p>
          </div>
        )}

        {/* Community Feed */}
        <Section
          title="Community Feed"
          action={
            <button
              className="btn-ghost"
              onClick={() => notify("Feed refreshed!", "success")}
            >
              🔄 Refresh
            </button>
          }
        >
          <PostForm onPost={handlePost} />
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onLike={handleLike}
              onShare={handleShare}
              onComment={(id) => notify(`Comments for post #${id}`, "info")}
            />
          ))}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button
              className="btn-ghost"
              onClick={() => notify("Loading more posts...", "info")}
            >
              ⬇ Load More Posts
            </button>
          </div>
        </Section>

        {/* Language Partners */}
        <Section
          title="Find Language Partners"
          action={
            <button
              className="btn-ghost"
              onClick={() => notify("New partners loaded!", "info")}
            >
              🔄 Refresh
            </button>
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
              gap: 16,
            }}
          >
            {partners.map((p) => (
              <PartnerCard key={p.id} partner={p} onConnect={handleConnect} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              className="btn-ghost"
              onClick={() => notify("Finding more partners...", "info")}
            >
              👥 Show More Partners
            </button>
          </div>
        </Section>

        {/* Study Groups */}
        <Section
          title="Join Study Groups"
          action={
            <button
              className="btn-coral"
              onClick={() => setShowCreateGroup(true)}
            >
              ＋ Create Group
            </button>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {groups.map((g) => (
              <GroupRow key={g.id} group={g} onOpen={openGroup} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              className="btn-ghost"
              onClick={() => notify("Browsing all groups...", "info")}
            >
              🔍 Browse All Groups
            </button>
          </div>
        </Section>
      </main>

      {/* Floating Action Button */}
      <button
        className="btn-coral"
        onClick={() => setShowCreateGroup(true)}
        style={{
          position: "fixed",
          bottom: 26,
          right: 26,
          width: 54,
          height: 54,
          borderRadius: "50%",
          padding: 0,
          fontSize: 22,
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(220,76,42,.4)",
          zIndex: 400,
        }}
      >
        ＋
      </button>

      {/* Modals & Overlays */}
      {showCreateGroup && (
        <CreateGroupModel
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
      {activeGroup && (
        <GroupInterface
          group={activeGroup}
          onClose={() => setActiveGroup(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
