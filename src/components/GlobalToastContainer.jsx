import React from "react";
import { useToast } from "../context/ToastContext";

export default function GlobalToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {toasts.map((toast) => {
        const bgColor =
          toast.type === "success"
            ? "#dcfce7"
            : toast.type === "error"
              ? "#fee2e2"
              : toast.type === "warning"
                ? "#fef3c7"
                : "#dbeafe";

        const borderColor =
          toast.type === "success"
            ? "#22c55e"
            : toast.type === "error"
              ? "#ef4444"
              : toast.type === "warning"
                ? "#eab308"
                : "#3b82f6";

        const textColor =
          toast.type === "success"
            ? "#166534"
            : toast.type === "error"
              ? "#991b1b"
              : toast.type === "warning"
                ? "#854d0e"
                : "#1e40af";

        const icon =
          toast.type === "success"
            ? "✓"
            : toast.type === "error"
              ? "✕"
              : toast.type === "warning"
                ? "⚠"
                : "ℹ";

        return (
          <div
            key={toast.id}
            style={{
              background: bgColor,
              border: `2px solid ${borderColor}`,
              color: textColor,
              padding: "1rem 1.25rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              maxWidth: "400px",
              pointerEvents: "auto",
              animation: "slideIn 0.3s ease-out",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {icon}
            </span>
            <span style={{ flex: 1, fontSize: "0.95rem", fontWeight: "500" }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: textColor,
                cursor: "pointer",
                fontSize: "1.25rem",
                padding: "0",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.7")}
            >
              ×
            </button>

            <style>{`
              @keyframes slideIn {
                from {
                  transform: translateX(400px);
                  opacity: 0;
                }
                to {
                  transform: translateX(0);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
