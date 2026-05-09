"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Code2, Loader2, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Telemetry rejected.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("System malfunction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: "google" | "github") => {
    signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden text-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vh] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary transition-colors z-20">
        <Code2 className="h-6 w-6 text-primary" />
        <span className="font-black tracking-tight text-xl">CodePrep</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary bg-primary/5 mb-2">
            Secure Access
          </Badge>
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Initialize your session to resume training</p>
        </div>

        <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="engineer@domain.com"
                  className="bg-black/50 border-white/10 focus-visible:ring-primary/50 focus-visible:border-primary/50 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Password</Label>
                  <Link href="#" className="text-[10px] text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/50 border-white/10 focus-visible:ring-primary/50 focus-visible:border-primary/50 h-12 font-mono tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12 font-bold shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_-5px_rgba(var(--primary),0.6)] transition-all group" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Initialize Session <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-all" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#0A0A0A] px-4 text-muted-foreground">External Auth</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => handleSocialSignIn("google")}
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                onClick={() => handleSocialSignIn("github")}
              >
                <FaGithub className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="justify-center bg-black/20 border-t border-white/5 py-4">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have clearance?{" "}
              <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                Request access
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
