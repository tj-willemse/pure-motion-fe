export function DashboardSkeleton({ navigation = false }: { navigation?: boolean }) {
  return (
    <main
      className={`dashboard-content dashboard-loading${navigation ? " dashboard-navigation-loading" : ""}`}
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading dashboard content"
    >
      <div className="dashboard-loading-heading" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="dashboard-stats dashboard-loading-stats" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="dashboard-loading-panel" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
