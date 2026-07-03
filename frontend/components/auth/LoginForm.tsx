"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";

export default function LoginForm() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [touched, setTouched] = useState({ email: false, password: false });
  const [focused, setFocused] = useState({ email: false, password: false });

  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address" : "";
  const passwordError = password && password.length < 6 ? "Password must be at least 6 characters" : "";

  const isFormValid = email.length > 0 && password.length > 0 && !emailError && !passwordError;

  // ==========================================
  // PATHWAY 1: STANDARD SUBMISSION LOGIC
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isFormValid) return;
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        // 🔥 TOASTER SETTER: Mount target string token right before hitting the push route
        localStorage.setItem("alqora_login_success", "true");
        router.push("/");
      } else {
        setError(result.error || "Please enter a valid email and password.");
      }
    } catch (err) {
      setError("An unexpected system error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const formInputGroup = (
    field: "email" | "password",
    type: string,
    label: string,
    placeholder: string,
    value: string,
    setter: (val: string) => void,
    errMessage: string
  ) => {
    const isFieldFocused = focused[field];
    const isFieldInvalid = touched[field] && !isFieldFocused && errMessage;

    return (
      <div className="relative w-full flex flex-col items-start pb-4">
        <label className="text-[11px] text-[#5C4A43] font-medium tracking-wide mb-1 uppercase transition-colors duration-300">
          {label}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setter(e.target.value);
            setError("");
          }}
          onFocus={() => setFocused((prev) => ({ ...prev, [field]: true }))}
          onBlur={() => {
            setFocused((prev) => ({ ...prev, [field]: false }));
            setTouched((prev) => ({ ...prev, [field]: true }));
          }}
          className="w-full pb-1.5 bg-transparent border-b border-[#2D211D]/20 text-[#2D211D] text-[15px] font-normal outline-none transition-all duration-300 focus:border-[#7A2E3A] placeholder-[#2D211D]/30"
        />
        <div className={`absolute bottom-4 left-0 h-[1.5px] bg-[#7A2E3A] transition-all duration-500 ${isFieldFocused ? "w-full" : "w-0"}`} />

        {isFieldInvalid && (
          <p className="absolute left-0 bottom-[-2px] text-[11px] text-[#A63B4C] font-normal tracking-wide transition-all duration-200">
            {errMessage}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col justify-center">
      <header className="mb-6 text-left">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8E7468] block mb-1">
          ACCOUNT ACCESS
        </span>
        <h1 className="text-[34px] lg:text-[38px] leading-[1.1] tracking-tight text-[#2D211D] font-serif mb-2">
          Sign In
        </h1>
        <p className="text-[#5C4A43] text-[13px] leading-relaxed font-light">
          Access your collection, wishlist, and editorial favorites.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
        {formInputGroup("email", "email", "Email Address", "yourname@example.com", email, setEmail, emailError)}
        {formInputGroup("password", "password", "Password", "••••••••", password, setPassword, passwordError)}

        {error && (
          <div className="bg-[#A63B4C]/5 border border-[#A63B4C]/15 rounded-lg p-2 text-[11px] text-[#A63B4C] text-center font-bold">
            {error}
          </div>
        )}

        <div className="pt-2 flex justify-center">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full h-11 rounded-full text-white text-[12px] font-semibold uppercase tracking-widest transition-all duration-300 shadow-sm ${
              loading || !isFormValid
                ? "bg-[#C6B7AF] cursor-not-allowed"
                : "bg-[#2D211D] hover:bg-[#7A2E3A]"
            }`}
          >
            {loading ? "Signing In..." : "Sign in"}
          </button>
        </div>

        <div className="flex items-center justify-center space-x-3 py-0.5">
          <div className="h-[1px] flex-1 bg-[#2D211D]/10" />
          <span className="text-[11px] text-[#8E7468]/60 font-light">or</span>
          <div className="h-[1px] flex-1 bg-[#2D211D]/10" />
        </div>

        {/* ==========================================
            PATHWAY 2: OAUTH GOOGLE SIGN IN
           ========================================== */}
        <div className="relative group">
          <div className="opacity-0 absolute inset-0 z-20">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await fetch(
                    `${API_URL}/auth/google`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    }
                  );

                  const data = await response.json();

                  if (data.success) {
                    googleLogin(data.user, data.token);

                    // 🔥 TOASTER SETTER: Mount the storage variable safely here for Google logins
                    localStorage.setItem("alqora_login_success", "true");
                    router.push("/");
                  }
                } catch (error) {
                  console.error(error);
                }
              }}
              onError={() => {
                toast.error("Google Login Failed");
              }}
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center space-x-2 w-full h-10 rounded-full border border-[#2D211D]/15 bg-white shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-[2px] group-hover:border-[#7A2E3A]/30 group-hover:bg-[#7A2E3A] group-hover:shadow-xl group-hover:shadow-[#2D211D]/10"
          >
            <svg
              className="w-3.5 h-3.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
              viewBox="0 0 24 24"
            >
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.222 1.151 15.46 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.77 0-.795-.085-1.4-.195-1.945H12.24z"
              />
            </svg>

            <span className="text-[11px] uppercase tracking-wider font-medium text-[#2D211D]/80 transition-colors duration-300 group-hover:text-white">
              Sign in with Google
            </span>
          </button>
        </div>

        <div className="text-center pt-1">
          <p className="text-[#8E7468] text-[12px] font-light inline-block mr-1">
            Don't have an account?
          </p>
          <Link
            href="/register"
            className="text-[11px] font-bold uppercase tracking-wider text-[#7A2E3A] hover:text-[#2D211D] transition-colors duration-300"
          >
            Create Account
          </Link>
        </div>
      </form>
    </div>
  );
}