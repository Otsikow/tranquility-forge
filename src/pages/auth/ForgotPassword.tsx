import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppBar } from "@/components/AppBar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-card">
      <AppBar title="Forgot Password" showBack backTo="/auth/login" />
      
      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-up">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">Reset Password</h1>
            <p className="text-muted-foreground mt-2 text-center">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="bg-primary/10 text-card-foreground border-primary">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription>
                Check your email! We've sent you a password reset link.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="bg-[hsl(var(--alert))] text-[hsl(var(--alert-foreground))] border-none">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!success && (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input border-border text-card-foreground"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
