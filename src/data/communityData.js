export const INITIAL_POSTS = [
  {
    id: 1, 
    author: "Maria Johnson", 
    initials: "MJ", 
    time: "2 hours ago",
    language: "Spanish", color: "#DC4C2A", likes: 42, comments: 8, shares: 3, liked: true,
    content: "Just completed my 30-day speaking streak! 🎉 I practiced Spanish for at least 15 minutes every day. The most challenging part was the subjunctive mood, but I'm finally getting the hang of it. Any tips for practicing speaking when you don't have a partner?",
  },
  {
    id: 2, author: "Takashi Kimura", initials: "TK", time: "5 hours ago",
    language: "English", color: "#2563EB", likes: 18, comments: 12, shares: 1, liked: false,
    content: "Can someone explain the difference between 'make' and 'do'? I always confuse these two.\n\nI wrote: 'I need to make my homework before I can do plans for the weekend.' Is this correct? 🤔",
  },
  {
    id: 3, author: "Sarah Lee", initials: "SL", time: "Yesterday",
    language: "French & Korean", color: "#7C3AED", likes: 31, comments: 5, shares: 7, liked: true,
    content: "Looking for a language exchange partner! 👋\n\nI speak: English (native), French (intermediate)\nI want to learn: Korean\nPreferred: Video calls 2-3x per week, 30 min each\n\nSend me a message! 💬",
  },
];

export const INITIAL_GROUPS = [
  {
    id: 1, name: "Spanish Conversation Club", icon: "💬",
    description: "Weekly conversations for all Spanish learners. Practice speaking in a friendly environment.",
    members: 28, language: "Spanish", level: "all", color: "#DC4C2A",
    messages: [
      { id: 1, sender: "Maria", initials: "MJ", text: "¡Hola a todos! ¿Cómo están hoy?", time: "10:30 AM", sent: false },
      { id: 2, sender: "Carlos", initials: "CR", text: "¡Hola! Muy bien, ¿alguien quiere practicar?", time: "10:32 AM", sent: false },
      { id: 3, sender: "You", initials: "ME", text: "¡Me encantaría! Tengo algunas preguntas.", time: "10:35 AM", sent: true },
    ],
    membersList: [
      { name: "Maria Johnson", initials: "MJ", status: "online" },
      { name: "Carlos Ruiz", initials: "CR", status: "online" },
      { name: "You", initials: "ME", status: "online" },
      { name: "Ana García", initials: "AG", status: "away" },
    ],
    resources: [
      { name: "Spanish Verb Guide", type: "PDF", icon: "📄" },
      { name: "Common Phrases", type: "DOC", icon: "📝" },
    ],
    events: [{ title: "Weekly Conversation", date: "Tomorrow", time: "3:00 PM", participants: 8 }],
  },
  {
    id: 2, name: "English Pronunciation Masters", icon: "🎙️",
    description: "Master English pronunciation with daily exercises and feedback from native speakers.",
    members: 21, language: "English", level: "intermediate", color: "#2563EB",
    messages: [], membersList: [], resources: [], events: [],
  },
  {
    id: 3, name: "Japanese Kanji Study Group", icon: "📚",
    description: "Learn 10 new kanji every week with memory techniques and practice sheets.",
    members: 14, language: "Japanese", level: "beginner", color: "#7C3AED",
    messages: [], membersList: [], resources: [], events: [],
  },
];

export const INITIAL_PARTNERS = [
  { id: 1, name: "Ahmad Raza", initials: "AR", country: "Pakistan", online: true, connected: false, color: "#059669", languages: ["Urdu (Native)", "English (Fluent)", "Learning Arabic"] },
  { id: 2, name: "Liu Chen", initials: "LC", country: "China", online: true, connected: false, color: "#2563EB", languages: ["Mandarin (Native)", "English (Inter.)", "Learning Spanish"] },
  { id: 3, name: "Elena Dubois", initials: "ED", country: "France", online: false, connected: false, color: "#DC4C2A", languages: ["French (Native)", "English (Fluent)", "Learning Japanese"] },
  { id: 4, name: "Roberto Gomez", initials: "RG", country: "Mexico", online: true, connected: false, color: "#7C3AED", languages: ["Spanish (Native)", "English (Adv.)", "Learning Portuguese"] },
];
