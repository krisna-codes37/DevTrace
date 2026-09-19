import { ArrowRight, KeyRound, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { getApiErrorMessage } from '../api/client.js';
import { useAuth } from '../context/useAuth.js';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Use at least 2 characters').max(100),
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().min(8, 'Use at least 8 characters').max(72),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit({ confirmPassword: _confirmPassword, ...values }) {
    try {
      await createAccount(values);
      navigate('/dashboard', {
        replace: true,
        state: { message: 'Your DevTrace account is ready.' },
      });
    } catch (error) {
      setError('root', { message: getApiErrorMessage(error) });
    }
  }

  return (
    <div className="auth-card register-card">
      <div className="auth-heading">
        <p className="eyebrow">Start tracing</p>
        <h1>Make the next breakthrough easier to remember.</h1>
        <p>
          Create a private workspace for the problems you solve and the lessons they leave behind.
        </p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          autoComplete="name"
          error={errors.name?.message}
          icon={<UserRound size={17} aria-hidden="true" />}
          label="Name"
          type="text"
          {...register('name')}
        />
        <FormField
          autoComplete="email"
          error={errors.email?.message}
          icon={<Mail size={17} aria-hidden="true" />}
          label="Email address"
          type="email"
          {...register('email')}
        />
        <FormField
          autoComplete="new-password"
          error={errors.password?.message}
          icon={<KeyRound size={17} aria-hidden="true" />}
          label="Password"
          type="password"
          {...register('password')}
        />
        <FormField
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          icon={<KeyRound size={17} aria-hidden="true" />}
          label="Confirm password"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.root && <p className="form-error form-error-summary">{errors.root.message}</p>}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
          {!isSubmitting && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
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
