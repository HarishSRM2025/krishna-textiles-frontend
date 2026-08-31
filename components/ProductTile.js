export default function ProductTile({ color, emoji, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}55)`,
      }}
    >
      <span style={{ fontSize: "3rem", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
        {emoji}
      </span>
    </div>
  );
}
