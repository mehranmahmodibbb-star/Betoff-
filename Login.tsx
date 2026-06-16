import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";
import { trpc } from "@/lib/trpc";
import { Mail, Lock, AlertCircle } from "lucide-react";

export default function Login() {
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      setError(error.message || "Login failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await loginMutation.mutateAsync({ email, password });
    } catch (err) {
      console.error("Login error:", err);
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
            {language === "fa" ? "خوش آمدید" : "Welcome Back"}
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
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            disabled={loading}
          >
            {loading
              ? language === "fa"
                ? "در حال ورود..."
                : "Logging in..."
              : language === "fa"
              ? "ورود"
              : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {language === "fa"
              ? "حساب کاربری ندارید؟"
              : "Don't have an account?"}
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/register")}
          >
            {language === "fa" ? "ثبت نام" : "Sign Up"}
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>
            {language === "fa"
              ? "با ورود، شما شرایط خدمات را قبول می‌کنید"
              : "By logging in, you accept our Terms of Service"}
          </p>
        </div>
      </Card>
    </div>
  );
}
