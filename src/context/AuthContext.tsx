import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import api from "../services/apiExtensions";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // treat stringified null/undefined/empty as missing values
    const hasValidToken = Boolean(
      storedToken && storedToken !== "null" && storedToken !== "undefined" && storedToken !== ""
    );

    if (hasValidToken) {
      setToken(storedToken);
    } else if (storedToken) {
      // cleanup bad token values stored previously
      localStorage.removeItem("token");
    }

    if (storedUser) {
        // storedUser may sometimes be the string "undefined" or invalid JSON
        try {
          const parsed = JSON.parse(storedUser);
          // ensure parsed appears to be an object with an _id or email to guard against bad data
          if (parsed && (parsed._id || parsed.email)) {
            setUser(parsed as User);
          } else {
            // invalid user data => remove it
            localStorage.removeItem("user");
          }
        } catch (err) {
          // invalid JSON in localStorage -> remove it to avoid the parsing error
          localStorage.removeItem("user");
          // Try to recover by asking the backend for the profile when possible
          try {
            // only try fetching the profile if we have a valid token
            if (hasValidToken) {
              api
              .getProfile()
              .then((r) => {
                const fetchedUser = r.data?.user || r.data;
                if (fetchedUser) {
                  setUser(fetchedUser);
                  localStorage.setItem("user", JSON.stringify(fetchedUser));
                }
              })
              .catch(() => {
                // profile fetch failed — clear token and user
                setToken(null);
                localStorage.removeItem("token");
              });
            }
          } catch {
            // ignore
          }
        }
      }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      // response.data may either be the payload directly or { data: payload }
      const payload = response.data?.data ?? response.data;
      const userData = payload?.user ?? payload?.userData ?? payload;
      const userToken = payload?.token ?? payload?.accessToken ?? null;

      setUser(userData || null);
      setToken(userToken || null);
      if (userToken) {
        localStorage.setItem("token", userToken);
      } else {
        localStorage.removeItem("token");
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await api.register(data);
      const payload = response.data?.data ?? response.data;
      const userData = payload?.user ?? payload?.userData ?? payload;
      const userToken = payload?.token ?? payload?.accessToken ?? null;

      setUser(userData || null);
      setToken(userToken || null);
      if (userToken) {
        localStorage.setItem("token", userToken);
      } else {
        localStorage.removeItem("token");
      }

      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    // Consider the user authenticated either when a user object exists
    // (cookie or profile-based flows) OR when an explicit token is present.
    isAuthenticated: Boolean(user || token),
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
