import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { getApiErrorMessage } from '../api/client.js';
import { useAuth } from '../context/useAuth.js';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [from] = [location.state?.from?.pathname ?? '/dashboard'];
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    try {
      await login(values);
      navigate(from, { replace: true, state: { message: 'Welcome back to DevTrace.' } });
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <p className="eyebrow">Welcome back</p>
        <h1>Pick up where the evidence left off.</h1>
        <p>Sign in to keep your debugging trail in one focused place.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          autoComplete="email"
          error={errors.email?.message}
          icon={<Mail size={17} aria-hidden="true" />}
          label="Email address"
          type="email"
          {...register('email')}
        />
        <FormField
          autoComplete="current-password"
          error={errors.password?.message}
          icon={<LockKeyhole size={17} aria-hidden="true" />}
          label="Password"
          type="password"
          {...register('password')}
        />
        {errors.root && <p className="form-error form-error-summary">{errors.root.message}</p>}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
          {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
      <p className="auth-switch">
        New to DevTrace? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

function FormField({ error, icon, label, ...inputProps }, ref) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className={`input-wrap${error ? ' has-error' : ''}`}>
        {icon}
        <input ref={ref} {...inputProps} />
      </span>
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
