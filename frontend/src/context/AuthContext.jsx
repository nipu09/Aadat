import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../api/index.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking the session

  useEffect(() => {
    auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const login = useCallback(async (email, password) => {
    setUser(await auth.login(email, password));
  }, []);

  const verifyEmail = useCallback(async (email, otp) => {
    setUser(await auth.verifyEmail(email, otp));
  }, []);

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading: user === undefined, login, verifyEmail, logout }),
    [user, login, verifyEmail, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
