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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      <Card
        variant="glass"
        className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-primary/20">
            iB
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Join iBarangay to access digital services
          </CardDescription>

          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                step === 1 ? "bg-primary w-8" : "bg-primary/30"
              }`}
            />
            <div
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                step === 2 ? "bg-primary w-8" : "bg-primary/30"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center gap-2 animate-in fade-in">
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
                      icon={<User className="h-4 w-4" />}
                      className="bg-background/50"
                    />
                  </FormField>
                  <FormField label="Last Name">
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      icon={<User className="h-4 w-4" />}
                      className="bg-background/50"
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
                    icon={<Mail className="h-4 w-4" />}
                    className="bg-background/50"
                  />
                </FormField>

                <FormField label="Phone Number (Optional)">
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="+63 900 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={<Phone className="h-4 w-4" />}
                    className="bg-background/50"
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
                    icon={<MapPin className="h-4 w-4" />}
                    className="bg-background/50"
                  />
                </FormField>

                <FormField label="Password">
                  <Input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock className="h-4 w-4" />}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
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
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    className="bg-background/50"
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
                  className="w-1/3"
                >
                  Back
                </Button>
              )}

              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full shadow-lg shadow-primary/20"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full shadow-lg shadow-primary/20"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
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
