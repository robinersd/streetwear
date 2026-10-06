import { isSupabaseConfigured } from './info';
import { localSignUp, localSignIn } from './localAuth';

export async function submitAuthentication(
  client: any,
  mode: 'login' | 'signup',
  credentials: { email: string; password: string; username: string },
): Promise<{ user: any; message: string }> {
  const email = credentials.email.trim();
  const password = credentials.password;

  // When no live external Supabase backend is configured, use local auth immediately
  if (!isSupabaseConfigured) {
    if (mode === 'signup') {
      return localSignUp(email, password, credentials.username);
    }
    return localSignIn(email, password);
  }

  // If a live Supabase backend is configured, try Supabase first
  try {
    if (mode === 'signup') {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { username: credentials.username.trim() } },
      });

      if (error) throw error;
      if (data.session?.user) return { user: data.session.user, message: '' };

      return {
        user: null,
        message: 'Check your email for a confirmation link, then return here to log in. If you already have an account, use Login.',
      };
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.session || !data.user) {
      throw new Error('Login did not create a session. Please try again.');
    }

    return { user: data.user, message: '' };
  } catch (err: any) {
    const message = err?.message || '';
    // Graceful fallback if the remote Supabase URL is unreachable or offline
    if (/failed to fetch|fetch failed|network|load failed|not resolved/i.test(message)) {
      console.warn('Supabase remote server unreachable, falling back to local auth mode:', err);
      if (mode === 'signup') {
        return localSignUp(email, password, credentials.username);
      }
      return localSignIn(email, password);
    }
    throw err;
  }
}

export function getAuthErrorMessage(error: unknown): string {
  const message = error && typeof error === 'object' && 'message' in error
    ? String(error.message)
    : '';

  if (/failed to fetch|fetch failed|network|load failed/i.test(message)) {
    return 'Unable to connect to the authentication service. Switched to offline local mode.';
  }

  return message || 'Unable to sign in. Please try again.';
}
