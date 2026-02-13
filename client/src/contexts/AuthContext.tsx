import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getSession, setSession, clearSession, findUser, addUser, addPharmacy, updateUser, genId, getUsers } from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: string) => boolean;
  signup: (userData: Omit<User, 'id'>, pharmacyName?: string) => string | null;
  logout: () => void;
  refreshUser: () => void;
  updateProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const s = getSession();
    if (s) setUser(s);
  }, []);

  const login = (username: string, password: string, role: string): boolean => {
    const u = findUser(username, password, role);
    if (u) { setSession(u); setUser(u); return true; }
    return false;
  };

  const signup = (userData: Omit<User, 'id'>, pharmacyName?: string): string | null => {
    const users = getUsers();
    if (users.find((u: User) => u.username === userData.username && u.role === userData.role)) {
      return 'Username already exists';
    }
    const id = genId();
    const newUser: User = { ...userData, id };

    if (userData.role === 'owner' && pharmacyName) {
      const pharmId = genId();
      newUser.pharmacyId = pharmId;
      addPharmacy({
        id: pharmId,
        name: pharmacyName,
        address: userData.address,
        phone: userData.phone,
        ownerId: id,
        licenseNumber: userData.licenseNumber || '',
      });
    }

    addUser(newUser);
    setSession(newUser);
    setUser(newUser);
    return null;
  };

  const logout = () => { clearSession(); setUser(null); };

  const refreshUser = () => {
    const s = getSession();
    if (s) setUser(s);
  };

  const updateProfileFn = (u: User) => {
    updateUser(u);
    setSession(u);
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, updateProfile: updateProfileFn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
