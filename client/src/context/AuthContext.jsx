import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { loginUser, registerUser } from "../api/auth.api";

const TOKEN_KEY = "eventhub_token";
const USER_KEY = "eventhub_user";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const getResponseData = (response) => {
  return response?.data ?? response;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const [user, setUser] = useState(getStoredUser);

  const saveSession = useCallback((authData) => {
    if (!authData?.token || !authData?.user) {
      throw new Error("Invalid authentication response from server.");
    }

    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));

    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await loginUser(credentials);
      const authData = getResponseData(response);

      saveSession(authData);

      return authData.user;
    },
    [saveSession],
  );

  const register = useCallback(
    async (formData) => {
      const response = await registerUser(formData);
      const authData = getResponseData(response);

      if (authData?.token && authData?.user) {
        saveSession(authData);
      }

      return authData;
    },
    [saveSession],
  );

  useEffect(() => {
    window.addEventListener("auth:unauthorized", logout);

    return () => {
      window.removeEventListener("auth:unauthorized", logout);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token && user),
      isOrganizer: user?.role === "ORGANIZER",
      isCustomer: user?.role === "CUSTOMER",
    }),
    [user, token, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
