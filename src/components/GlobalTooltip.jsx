import { createPortal } from "react-dom";

export default function GlobalTooltip({ text, pos }) {
    if (!pos) return null;

    return createPortal(
        <div
            style={{
                position: "fixed",
                top: pos.y,
                left: pos.x,
                padding: "8px 12px",
                background: "rgba(0, 0, 0, 0.85)",
                color: "white",
                borderRadius: "6px",
                maxWidth: "250px",
                fontSize: "14px",
                zIndex: 999999,
                pointerEvents: "none",
                whiteSpace: "normal",
            }}
        >
            {text}
        </div>,
        document.body
    );
}