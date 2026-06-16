import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";
import { trpc } from "@/lib/trpc";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      setError(error.message || "Registration failed");
    },
  });

  const checkPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain uppercase, lowercase, and numbers");
      return;
    }

    setLoading(true);
    try {
      await registerMutation.mutateAsync({ email, password, name: name || undefined });
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="w-full max-w-md p-8 bg-card border border-border">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-accent-foreground font-bold text-xl mx-auto mb-4">
            B
          </div>
          <h1 className="text-2xl font-bold mb-2">BetOff</h1>
          <p className="text-muted-foreground">
            {language === "fa" ? "ثبت نام کنید" : "Create Account"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "fa" ? "نام" : "Full Name"}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={language === "fa" ? "نام کامل" : "John Doe"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "fa" ? "ایمیل" : "Email"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "fa" ? "رمز عبور" : "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
            {password && (
              <div className="mt-2 flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < passwordStrength ? "bg-accent" : "bg-secondary"
                    }`}
                  />
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {language === "fa"
                ? "حداقل 8 کاراکتر، شامل بزرگ، کوچک و عدد"
                : "Min 8 chars, uppercase, lowercase, number"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "fa" ? "تأیید رمز عبور" : "Confirm Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            {confirmPassword && password === confirmPassword && (
              <div className="mt-2 flex items-center gap-2 text-sm text-accent">
                <CheckCircle className="w-4 h-4" />
                {language === "fa" ? "رمز عبور مطابقت دارد" : "Passwords match"}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={loading}
          >
            {loading
              ? language === "fa"
                ? "در حال ثبت نام..."
                : "Signing up..."
              : language === "fa"
              ? "ثبت نام"
              : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {language === "fa"
              ? "قبلاً حساب کاربری دارید؟"
              : "Already have an account?"}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/login")}
          >
            {language === "fa" ? "ورود" : "Login"}
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            {language === "fa"
              ? "با ثبت نام، شما شرایط خدمات را قبول می‌کنید"
              : "By signing up, you accept our Terms of Service"}
          </p>
        </div>
      </Card>
    </div>
  );
}
