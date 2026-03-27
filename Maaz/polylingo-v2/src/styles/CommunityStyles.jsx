const CommunityStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    .plg-root * { box-sizing: border-box; }
    .plg-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #F8F7F3; min-height: 100vh; color: #1C1917; }

    /* ── Buttons ── */
    .btn-coral {
      background: #DC4C2A; color: #fff; border: none; border-radius: 10px;
      padding: 9px 18px; font-weight: 600; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
      display: inline-flex; align-items: center; gap: 7px; transition: all .2s;
    }
    .btn-coral:hover { background: #C43F20; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(220,76,42,.25); }
    .btn-coral:disabled { opacity: .45; pointer-events: none; }

    .btn-ghost {
      background: transparent; color: #6B7280; border: 1.5px solid #E5E7EB;
      border-radius: 10px; padding: 8px 16px; font-weight: 500; cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px;
      display: inline-flex; align-items: center; gap: 7px; transition: all .2s;
    }
    .btn-ghost:hover { border-color: #DC4C2A; color: #DC4C2A; background: #FEF2ED; }

    /* ── Cards ── */
    .card {
      background: #fff; border: 1px solid #E7E5E0; border-radius: 16px; transition: all .25s;
    }
    .card:hover { border-color: #C7C4BB; box-shadow: 0 4px 24px rgba(0,0,0,.07); }

    /* ── Form controls ── */
    .fc {
      width: 100%; padding: 10px 14px; border: 1.5px solid #E5E7EB; border-radius: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; color: #1C1917;
      background: #fff; transition: border-color .2s;
    }
    .fc:focus { outline: none; border-color: #DC4C2A; box-shadow: 0 0 0 3px rgba(220,76,42,.1); }

    .fc-area {
      width: 100%; padding: 13px; border: 1.5px solid #E5E7EB; border-radius: 12px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; resize: none;
      background: #F8F7F3; transition: all .2s;
    }
    .fc-area:focus { outline: none; border-color: #DC4C2A; background: #fff; box-shadow: 0 0 0 3px rgba(220,76,42,.08); }

    .chat-fc {
      flex: 1; padding: 9px 13px; border: 1.5px solid #E5E7EB; border-radius: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; resize: none;
    }
    .chat-fc:focus { outline: none; border-color: #DC4C2A; box-shadow: 0 0 0 3px rgba(220,76,42,.1); }

    /* ── Post actions ── */
    .pact {
      background: none; border: none; color: #6B7280; display: flex; align-items: center;
      gap: 6px; cursor: pointer; padding: 6px 10px; border-radius: 8px;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all .2s;
    }
    .pact:hover { background: #FEF2ED; color: #DC4C2A; }
    .pact.liked { color: #DC4C2A; }

    /* ── Group tab buttons ── */
    .gtab {
      padding: 10px 16px; border: none; background: transparent;
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500;
      color: #6B7280; cursor: pointer; border-bottom: 2px solid transparent;
      display: flex; align-items: center; gap: 6px; white-space: nowrap; transition: all .2s;
    }
    .gtab:hover { color: #DC4C2A; }
    .gtab.active { color: #DC4C2A; border-bottom-color: #DC4C2A; font-weight: 700; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

    /* ── Animations ── */
    @keyframes slideInRight {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-in-up { animation: fadeInUp .3s ease; }

    /* ── Tags / pills ── */
    .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .tag-green  { background: #D1FAE5; color: #065F46; }
    .tag-blue   { background: #DBEAFE; color: #1E40AF; }
    .tag-orange { background: #FEE2D5; color: #9A2E10; }
    .tag-purple { background: #EDE9FE; color: #4C1D95; }

    /* ── Group interface ── */
    .gi-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center;
      z-index: 900; padding: 20px; backdrop-filter: blur(5px);
    }
    .gi-box {
      background: #fff; border-radius: 20px; width: 100%; max-width: 1060px;
      height: 88vh; display: flex; flex-direction: column; overflow: hidden;
      animation: fadeInUp .3s ease;
    }
    .chat-msgs { flex: 1; overflow-y: auto; padding: 20px; }

    /* ── Avatar ── */
    .ava {
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 700; color: #fff; flex-shrink: 0;
    }

    /* ── Overlay (modal) ── */
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.48);
      display: flex; align-items: center; justify-content: center;
      z-index: 800; padding: 16px; backdrop-filter: blur(4px);
    }
  `}</style>
);

export default CommunityStyles;
