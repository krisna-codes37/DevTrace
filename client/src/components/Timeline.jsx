import { Beaker, Check, CircleDot, Flag, GitBranch, Lightbulb, Wrench } from 'lucide-react';

const eventIcons = {
  created: Flag,
  hypothesis: Lightbulb,
  experiment: Beaker,
  status: GitBranch,
  rootCause: CircleDot,
  solution: Wrench,
  solved: Check,
};

export default function Timeline({ events, isLoading = false }) {
  return (
    <section className="journey-timeline" aria-label="Debugging journey timeline">
      <div className="journey-heading">
        <div>
          <p className="eyebrow">Trace the work</p>
          <h2>Debugging journey</h2>
        </div>
        <span className="journey-event-count">{events.length} events</span>
      </div>
      {isLoading ? (
        <TimelineSkeleton />
      ) : events.length === 0 ? (
        <p className="timeline-empty">The journey will take shape as you document the work.</p>
      ) : (
        <ol className="timeline-list">
          {events.map((event) => {
            const Icon = eventIcons[event.type] ?? CircleDot;
            return (
              <li className={`timeline-event timeline-${event.type}`} key={event.id}>
                <span className="timeline-node" aria-hidden="true">
                  <Icon size={14} />
                </span>
                <div className="timeline-event-body">
                  <div className="timeline-event-meta">
                    <span className="timeline-event-title">{event.title}</span>
                    <time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time>
                  </div>
                  <p>{event.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function TimelineSkeleton() {
  return (
    <ol className="timeline-list timeline-skeleton-list" aria-busy="true">
      {[1, 2, 3].map((item) => (
        <li className="timeline-event" key={item}>
          <span className="timeline-node" />
          <div className="timeline-event-body">
            <span className="timeline-skeleton-line" />
            <span className="timeline-skeleton-line short" />
          </div>
        </li>
      ))}
    </ol>
  );
}

function formatTimestamp(value) {
  if (!value) return 'Unknown time';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
}
