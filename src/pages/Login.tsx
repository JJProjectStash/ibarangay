import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { showSuccessToast, showErrorToast } from "../components/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      showSuccessToast("Login successful! Welcome back!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err instanceof Error ? err.message : "Invalid email or password");
      setError(errorMessage);
      showErrorToast("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background with Gradient Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#5b21b6]" />

        {/* Large blur orbs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />
      </div>

      <Card
        variant="glass"
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 border-2 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
      >
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-2xl backdrop-blur-sm border-2 border-white/30">
            iB
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-white/70">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <FormField label="Email" error={error ? " " : undefined}>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail className="h-4 w-4 text-white/60" />}
                className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                disabled={isLoading}
              />
            </FormField>

            <FormField label="Password">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock className="h-4 w-4 text-white/60" />}
                  className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                <Link
                  to="/forgot-password"
                  className="absolute right-0 top-0 -mt-7 text-xs font-medium text-purple-300 hover:text-purple-200 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </FormField>

            <Button
              type="submit"
              className="w-full font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02]"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1e1b4b]/50 backdrop-blur-xl px-3 py-1 rounded-full text-white/60 border border-white/20">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button
              variant="outline"
              className="w-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300"
              type="button"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300"
              type="button"
            >
              Facebook
            </Button>
          </div>

          <p className="pt-4 text-white/70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-purple-300 hover:text-purple-200 hover:underline underline-offset-4 transition-colors"
            >
              Sign up
            </Link>
          </p>

          {/* Demo Accounts Section */}
          <div className="w-full p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-left space-y-2 shadow-lg">
            <p className="font-semibold text-white">🎯 Demo Accounts:</p>
            <p className="text-xs text-white/80">
              👨‍💼 Admin: admin@barangay.com / admin123
            </p>
            <p className="text-xs text-white/80">
              👤 Resident: resident@barangay.com / resident123
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
