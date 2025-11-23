import React, { useState } from "react";
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
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError("Please create a password");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background with Gradient Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#5b21b6]" />

        {/* Large blur orbs */}
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 blur-3xl animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "3s" }}
        />
        <div
          className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl animate-pulse"
          style={{ animationDuration: "14s", animationDelay: "5s" }}
        />
      </div>

      <Card
        variant="glass"
        className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 border-2 border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
      >
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-2xl backdrop-blur-sm border-2 border-white/30">
            iB
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-white/70">
            Join iBarangay to access digital services
          </CardDescription>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === 1
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 w-8"
                  : "bg-white/20 w-2"
              }`}
            />
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                step === 2
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 w-8"
                  : "bg-white/20 w-2"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First Name">
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      icon={<User className="h-4 w-4 text-white/60" />}
                      className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      icon={<User className="h-4 w-4 text-white/60" />}
                      className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                    />
                  </FormField>
                </div>

                <FormField label="Email Address">
                  <Input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail className="h-4 w-4 text-white/60" />}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                </FormField>

                <FormField label="Phone Number (Optional)">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+63 900 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone className="h-4 w-4 text-white/60" />}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                </FormField>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <FormField label="Address (Optional)">
                  <Input
                    name="address"
                    placeholder="House No., Street, Barangay"
                    value={formData.address}
                    onChange={handleChange}
                    icon={<MapPin className="h-4 w-4 text-white/60" />}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                </FormField>

                <FormField label="Password">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock className="h-4 w-4 text-white/60" />}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    Must be at least 6 characters long
                  </p>
                </FormField>

                <FormField label="Confirm Password">
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<CheckCircle2 className="h-4 w-4 text-white/60" />}
                    className="bg-white/10 backdrop-blur-xl border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 text-white placeholder:text-white/40"
                  />
                </FormField>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20 text-white transition-all duration-300"
                >
                  Back
                </Button>
              )}

              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02]"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-[1.02]"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-white/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-300 hover:text-purple-200 hover:underline underline-offset-4 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
