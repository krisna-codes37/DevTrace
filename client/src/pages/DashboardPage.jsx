import {
  Activity,
  ArrowUpRight,
  CircleDot,
  Clock3,
  FolderKanban,
  Plus,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { getApiErrorMessage } from '../api/client.js';
import { useAuth } from '../context/useAuth.js';
import { useDashboardStats } from '../hooks/useDashboard.js';

const chartColors = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#fb7185', '#c084fc'];
const severityLabels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' };

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={getApiErrorMessage(error)} />;

  const technologyData = data?.technologyDistribution ?? [];
  const recentSessions = data?.recentSessions ?? [];
  const hasSessions = data?.totalSessions > 0;

  return (
    <section className="page-container dashboard-page">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">
            <Sparkles size={13} /> Debugging workspace
          </p>
          <h1 className="page-title">
            Good afternoon, {user?.name?.split(' ')[0] ?? 'developer'}.
          </h1>
          <p className="page-subtitle">What are you debugging today?</p>
        </div>
        <Link className="primary-button" to="/sessions/new">
          <Plus size={17} aria-hidden="true" /> New debugging session
        </Link>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard
          icon={<FolderKanban size={18} />}
          label="Total sessions"
          value={data?.totalSessions ?? 0}
          tone="violet"
        />
        <StatCard
          icon={<CircleDot size={18} />}
          label="Solved sessions"
          value={data?.solvedSessions ?? 0}
          tone="green"
        />
        <StatCard
          icon={<Activity size={18} />}
          label="Open sessions"
          value={data?.openSessions ?? 0}
          tone="blue"
        />
        <StatCard
          icon={<Clock3 size={18} />}
          label="In progress"
          value={data?.inProgressSessions ?? 0}
          tone="amber"
        />
      </div>

      {!hasSessions ? (
        <DashboardEmptyState />
      ) : (
        <div className="dashboard-content-grid">
          <section className="dashboard-panel technology-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">By technology</p>
                <h2>What your work touches</h2>
              </div>
            </div>
            {technologyData.length === 0 ? (
              <PanelEmpty text="Technology data will appear as sessions are tagged." />
            ) : (
              <div className="technology-chart">
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie
                      data={technologyData}
                      dataKey="count"
                      nameKey="technology"
                      innerRadius={62}
                      outerRadius={88}
                      paddingAngle={3}
                    >
                      {technologyData.map((entry, index) => (
                        <Cell
                          key={entry.technology}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="technology-legend">
                  {technologyData.slice(0, 6).map((item, index) => (
                    <div className="legend-item" key={item.technology}>
                      <span style={{ background: chartColors[index % chartColors.length] }} />{' '}
                      <span>{item.technology}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          <section className="dashboard-panel recent-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Latest activity</p>
                <h2>Recent sessions</h2>
              </div>
              <Link className="panel-link" to="/sessions">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="recent-list">
              {recentSessions.map((session) => (
                <RecentSession key={session._id} session={session} />
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function StatCard({ icon, label, tone, value }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
function RecentSession({ session }) {
  return (
    <Link className="recent-session" to={`/sessions/${session._id}`}>
      <span className={`status-dot status-${session.status?.toLowerCase()}`} />
      <div>
        <strong>{session.title}</strong>
        <span>
          {session.technology || 'Unspecified'} <i>/</i> {formatDate(session.updatedAt)}
        </span>
      </div>
      <span className={`severity-badge severity-${session.severity?.toLowerCase()}`}>
        {severityLabels[session.severity] ?? 'Unrated'}
      </span>
    </Link>
  );
}
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{payload[0].name}</strong>
      <span>
        {payload[0].value} {payload[0].value === 1 ? 'session' : 'sessions'}
      </span>
    </div>
  );
}
function PanelEmpty({ text }) {
  return (
    <div className="panel-empty">
      <span>{text}</span>
    </div>
  );
}
function DashboardEmptyState() {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty-mark">
        <FolderKanban size={22} />
      </div>
      <h2>Your debugging signal starts here.</h2>
      <p>Create a session to see patterns, progress, and recent work appear on this dashboard.</p>
      <Link className="primary-button compact-button" to="/sessions/new">
        <Plus size={16} /> Create your first session
      </Link>
    </div>
  );
}
function DashboardSkeleton() {
  return (
    <section
      className="page-container dashboard-page"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="dashboard-skeleton-hero">
        <span />
        <span />
      </div>
      <div className="dashboard-stats-grid">
        {[1, 2, 3, 4].map((item) => (
          <div className="stat-skeleton" key={item}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
      <div className="dashboard-content-grid">
        <div className="dashboard-panel skeleton-panel" />
        <div className="dashboard-panel skeleton-panel" />
      </div>
    </section>
  );
}
function DashboardError({ message }) {
  return (
    <section className="page-container">
      <div className="empty-state error-state">
        <h2>Dashboard could not load</h2>
        <p>{message}</p>
      </div>
    </section>
  );
}
function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
    : 'No date';
}
