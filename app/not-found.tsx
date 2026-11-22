import Link from "next/link";

export default function NotFound() {
  return (
    <div className="stack">
      <div className="head">
        <div>
          <div className="eyebrow">404</div>
          <h1 className="mt-1.5">Nie ma takiego ekranu</h1>
          <p className="sub">Nie znaleziono w przeanalizowanych źródłach.</p>
        </div>
      </div>
      <div>
        <Link href="/pulpit" className="btn primary">
          Wróć na pulpit
        </Link>
      </div>
    </div>
  );
}
