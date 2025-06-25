"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, X } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  // Auto-dismiss toast after duration
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration || 5000); // Default 5 seconds

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const goToHome = () => router.push("/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);


    if (!email || !password) {
      setToast({
        type: "error",
        title: "Missing Information",
        message: "Please enter both email and password to continue",
        duration: 4000,
      });
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast({
        type: "success",
        title: "Welcome!",
        message: "Successfully signed in. Redirecting to dashboard...",
        duration: 3000,
      });
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {

      try {
        // Call the API route to send the email
        await fetch('/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'sibanaevelyn2528@gmail.com', //this is the email for the login attempt 
            alertType: 'security',
            details: email,
          }),
        });
        
      } catch (err) {
        console.error('Failed to send email:', err);
      }

      let errorMessage = "An error occurred during sign in";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        default:
          errorMessage = "Invalid password or email. Please try again";
      }

      setToast({
        type: "error",
        title: "Sign In Failed",
        message: errorMessage,
        duration: 5000,
      });
      setIsLoading(false);
    }
  };

  const dismissToast = () => setToast(null);

  return (
    <div className="min-h-screen bg-black flex flex-col relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#CFD6FF]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg text-sm backdrop-blur-sm border min-w-[320px] max-w-md animate-slide-down ${
            toast.type === "success"
              ? "bg-green-500/20 border-green-500/30"
              : "bg-red-500/20 border-red-500/30"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3
                className={`font-semibold ${
                  toast.type === "success" ? "text-green-300" : "text-red-300"
                }`}
              >
                {toast.title}
              </h3>
              <p
                className={`mt-1 ${
                  toast.type === "success" ? "text-green-200" : "text-red-200"
                }`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={dismissToast}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors duration-200 ${
                toast.type === "success" ? "text-green-300" : "text-red-300"
              }`}
            >
              <X size={16} />
            </button>
          </div>
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full overflow-hidden">
            <div
              className={`h-full ${
                toast.type === "success" ? "bg-green-400" : "bg-red-400"
              }`}
              style={{
                animation: `shrink ${toast.duration}ms linear forwards`,
              }}
            />
          </div>
        </div>
      )}

      {/* Header with Logo */}
      <header className="flex justify-start p-8 z-10">
        <button
          onClick={goToHome}
          className="group flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#CFD6FF] to-purple-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-[#CFD6FF] transition-all duration-300">
            HomePulse
          </span>
        </button>
      </header>

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center z-10 px-4">
        <div className="w-full max-w-md bg-black/30 backdrop-blur-md border border-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="inline-block mb-4 px-5 py-1.5 rounded-full bg-[#CFD6FF]/10 border border-[#CFD6FF]/20 backdrop-blur-sm">
              <span className="text-[#CFD6FF] font-medium tracking-wide">
                Sign In
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mt-4">Welcome Back</h1>
            <p className="text-gray-300 mt-2">Secure. Smart. Connected.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label
                htmlFor="email"
                className="block text-sm text-gray-300 mb-2 group-focus-within:text-[#CFD6FF] transition-colors duration-300"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-2.5 text-[#CFD6FF]"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 w-full bg-gray-900/30 border border-gray-800/50 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CFD6FF]/50 focus:border-[#CFD6FF]/50 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label
                htmlFor="password"
                className="block text-sm text-gray-300 mb-2 group-focus-within:text-[#CFD6FF] transition-colors duration-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-2.5 text-[#CFD6FF]"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  placeholder=""
                  className="pl-10 w-full bg-gray-900/30 border border-gray-800/50 text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#CFD6FF]/50 focus:border-[#CFD6FF]/50 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#CFD6FF] hover:bg-opacity-90 text-black font-semibold rounded-xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#CFD6FF]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-gray-400 text-center mt-8">
            Don&apos;t have an account?{" "}
            <a
              href="mailto:sibanaevelyn2528@gmail.com"
              className="text-[#CFD6FF] hover:text-[#CFD6FF]/80 transition-colors duration-300"
            >
              Contact us
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
