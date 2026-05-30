export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface StoredUser {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  password: string;
}

const USERS_KEY = 'fp_users';

const toSessionUser = (user: StoredUser): SessionUser => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: 'admin',
});

const getStoredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginLocal = (email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getStoredUsers().find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('login.invalidCredentials');
  }

  return {
    token: `local-${user.id}-${Date.now()}`,
    user: toSessionUser(user),
  };
};

export const signupLocal = (
  email: string,
  password: string,
  name: string,
  phone?: string
) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('signup.emailExists');
  }

  const newUser: StoredUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    email: normalizedEmail,
    name: name.trim(),
    phone: phone?.trim() || null,
    password,
  };

  saveUsers([...users, newUser]);

  return {
    token: `local-${newUser.id}-${Date.now()}`,
    user: toSessionUser(newUser),
  };
};

export const normalizeSessionUser = (user: SessionUser): SessionUser => ({
  ...user,
  role: 'admin',
});
