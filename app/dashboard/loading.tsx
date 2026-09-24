export default function DashboardLoading() {
  return (
    <main className="dashboard-content" aria-busy="true" aria-live="polite">
      <div className="dashboard-loading-heading">
        <span />
        <span />
      </div>
      <div className="dashboard-stats dashboard-loading-stats">
        <span />
        <span />
        <span />
      </div>
      <div className="dashboard-loading-panel">
        <span />
        <span />
        <span />
      </div>
      <p className="dashboard-loading-label">Loading your dashboard…</p>
    </main>
  );
}
