import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="page-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">KFC operations</p>
          <h1>Daily sales forecast</h1>
        </div>
        <div className="header-status">
          <span className="status-dot" />
          Persisted forecasts
        </div>
      </header>
      {children}
    </main>
  );
}

