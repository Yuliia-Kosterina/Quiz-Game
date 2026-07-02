import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        width: "min(760px, calc(100% - 32px))",
        margin: "40px auto",
        padding: "28px",
        borderRadius: "20px",
        border: "1px solid rgba(247, 217, 106, 0.28)",
        background: "rgba(9, 13, 63, 0.8)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1>404</h1>
      <p>Страница не найдена.</p>
      <Link href="/" style={{ color: "#f7d96a" }}>
        Вернуться на главную
      </Link>
    </div>
  );
}
