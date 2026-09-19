export default function SessionSkeleton({ rows = 4 }) {
  return (
    <div className="session-skeleton-list" aria-label="Loading sessions" aria-busy="true">
      {Array.from({ length: rows }, (_, index) => (
        <div className="session-skeleton" key={index}>
          <span className="skeleton-line skeleton-title" />
          <span className="skeleton-line" />
          <span className="skeleton-line skeleton-short" />
        </div>
      ))}
    </div>
  );
}
