export interface LocalUser {
  id: string;
  email: string;
  password?: string;
  user_metadata: {
    username?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface LocalSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  user: LocalUser;
}

const USERS_STORAGE_KEY = 'streetwear_local_users';
const SESSION_STORAGE_KEY = 'streetwear_local_session';

// Pre-seeded demo user for instant one-click testing
const DEMO_USER: LocalUser = {
  id: 'user_demo_streetwear',
  email: 'demo@streetwear.com',
  password: 'password123',
  user_metadata: {
    username: 'StreetwearVIP'
  },
  created_at: '2026-01-01T00:00:00.000Z'
};

export function getStoredUsers(): LocalUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = [DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return [DEMO_USER];
  }
}

export function saveStoredUsers(users: LocalUser[]) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function getStoredSession(): LocalSession | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(user: LocalUser): LocalSession {
  const session: LocalSession = {
    access_token: 'local_token_' + Math.random().toString(36).substring(2),
    token_type: 'bearer',
    expires_in: 86400,
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    user: {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata || { username: user.email.split('@')[0] },
      created_at: user.created_at
    }
  };
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }
  return session;
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session from localStorage', err);
  }
}

export function localSignUp(email: string, password: string, username: string) {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getStoredUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const newUser: LocalUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 10),
    email: cleanEmail,
    password: password,
    user_metadata: {
      username: username.trim() || cleanEmail.split('@')[0]
    },
    created_at: new Date().toISOString()
  };

  users.push(newUser);
  saveStoredUsers(users);

  const session = setStoredSession(newUser);
  return { user: session.user, message: '' };
}

export function localSignIn(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    throw new Error('Please enter your email.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const users = getStoredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!found) {
    throw new Error('No account found with this email. Please click "Sign Up" to create an account.');
  }

  if (found.password !== password) {
    throw new Error('Incorrect password. Please try again.');
  }

  const session = setStoredSession(found);
  return { user: session.user, message: '' };
}
