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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      <Card
        variant="glass"
        className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary/20">
            iB
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 animate-in fade-in">
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
                icon={<Mail className="h-4 w-4" />}
                className="bg-background/50"
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
                  icon={<Lock className="h-4 w-4" />}
                  className="bg-background/50 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  className="absolute right-0 top-0 -mt-7 text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </FormField>

            <Button
              type="submit"
              className="w-full font-semibold shadow-lg shadow-primary/20"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="w-full" type="button">
              Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              Facebook
            </Button>
          </div>

          <p className="pt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
            >
              Sign up
            </Link>
          </p>

          {/* Demo Accounts Section */}
          <div className="w-full p-4 bg-muted/50 rounded-lg border text-left space-y-2">
            <p className="font-semibold text-foreground">🎯 Demo Accounts:</p>
            <p className="text-xs">👨‍💼 Admin: admin@barangay.com / admin123</p>
            <p className="text-xs">
              👤 Resident: resident@barangay.com / resident123
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
