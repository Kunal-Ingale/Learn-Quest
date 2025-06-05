"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import Header from "@/components/layout/Header";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully");
      router.push("/home");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      toast.success("Account created successfully");
      router.push("/home");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Logged in with Google");
      router.push("/home");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen text-foreground">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-purple-400 text-white p-10 flex flex-col justify-center min-h-[60vh] md:min-h-screen">
          <div>
            <Link href="/" className="text-4xl font-bold mb-6 inline-block">
              LearnQuest
            </Link>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Transform Your Learning Experience
            </h1>
            <p className="text-lg text-white/90 mb-6">
              Convert YouTube videos into structured, interactive courses. Learn
              at your own pace.
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <p className="text-lg">Join our learning community today!</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-6 md:p-16 flex items-center justify-center bg-white">
          <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="text-center">
              <Link href="/" className="md:hidden inline-block mb-6">
                <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-accent-500">
                  LearningTube
                </h1>
              </Link>
              <h2 className="text-3xl font-semibold text-gray-900">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Login or create an account to continue
              </p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 border rounded-lg bg-muted p-1">
                <TabsTrigger
                  value="login"
                  className="text-base font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-brand-600"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-base font-medium rounded-lg data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-brand-600"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-brand-500 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg bg-brand-500 text-white hover:bg-brand-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-3 text-lg bg-brand-500 text-white hover:bg-brand-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase text-gray-500 bg-white px-2">
                Or continue with
              </div>
            </div>

            {/* Google Auth */}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-17.4-1.5-34.1-4.4-50.4H272v95.5h146.7c-6.3 34-25.5 62.7-54.7 81.9v67h88.3c51.7-47.6 81.2-118 81.2-193z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c73.5 0 135.3-24.4 180.4-66.3l-88.3-67c-24.6 16.5-56.2 26.2-92.1 26.2-70.8 0-130.8-47.9-152.4-112.5H32.7v70.8C77.8 490.6 168.3 544.3 272 544.3z"
                />
                <path
                  fill="#FBBC05"
                  d="M119.6 320.7c-5.6-16.8-8.8-34.7-8.8-53.1s3.2-36.3 8.8-53.1v-70.8H32.7c-18.4 36.3-28.9 77-28.9 123.9s10.5 87.6 28.9 123.9l86.9-70.8z"
                />
                <path
                  fill="#EA4335"
                  d="M272 107.7c39.8 0 75.3 13.7 103.3 40.8l77.5-77.5C408.7 24.4 346.9 0 272 0 168.3 0 77.8 53.7 32.7 134.6l86.9 70.8c21.6-64.6 81.6-112.5 152.4-112.5z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
