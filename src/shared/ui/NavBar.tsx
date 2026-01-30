type NavBarProps = {
  title?: string;
};

export function NavBar({ title }: NavBarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#3a677ab4",
        width: "100%",
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "12px 24px",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>{title}</div>
      </div>
    </header>
  );
}