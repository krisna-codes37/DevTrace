import { Activity, ShieldCheck } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const location = useLocation();

  return (
    <main className="auth-page">
      <div className="auth-atmosphere" aria-hidden="true" />
      <section className="auth-frame" aria-label="DevTrace authentication">
        <Link className="brand-lockup" to="/login" aria-label="DevTrace home">
          <span className="brand-mark">
            <Activity size={19} strokeWidth={2.5} />
          </span>
          <span>DevTrace</span>
        </Link>
        {location.state?.message && <p className="success-message">{location.state.message}</p>}
        <Outlet />
        <div className="auth-footnote">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Your debugging journal, kept private.</span>
        </div>
      </section>
    </main>
  );
}
