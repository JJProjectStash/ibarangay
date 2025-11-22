import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { showToast } from "../utils/toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      showToast({
        message: "Login successful! Welcome back.",
        type: "success",
      });
      navigate("/");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      showToast({ message: errorMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md animate-in">
        <Card className="shadow-xl border-0 glass-card">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg float">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold gradient-text-primary">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base">
              Login to access your iBarangay account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@example.com"
                  required
                  disabled={isLoading}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to iBarangay?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/signup"
                className="text-primary hover:text-primary-dark font-semibold transition-colors inline-flex items-center gap-1 hover:gap-2"
              >
                Create an account
                <span className="transition-transform">→</span>
              </Link>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 space-y-2">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  🎯 Demo Accounts
                </p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      👨‍💼 Admin:
                    </span>
                    admin@barangay.com / admin123
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      👤 Resident:
                    </span>
                    resident@barangay.com / resident123
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
