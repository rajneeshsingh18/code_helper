"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Code2, Loader2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Access denied. Registration failed.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Failed to initialize session after registration.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("System malfunction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden text-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vh] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground hover:text-primary transition-colors z-20">
        <Code2 className="h-6 w-6 text-primary" />
        <span className="font-black tracking-tight text-xl">CodePrep</span>
      </Link>

      <div className="w-full max-w-md relative z-10 my-12">
        <div className="flex flex-col items-center mb-8 text-center space-y-2">
          <Badge variant="outline" className="text-[10px] tracking-widest uppercase border-primary/30 text-primary bg-primary/5 mb-2">
            New Engineer
          </Badge>
          <h1 className="text-3xl font-black tracking-tight">Request Access</h1>
          <p className="text-muted-foreground text-sm">Create your profile to start tracking metrics</p>
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
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Codename</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="bg-black/50 border-white/10 focus-visible:ring-primary/50 focus-visible:border-primary/50 h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Passkey</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-black/50 border-white/10 focus-visible:ring-primary/50 focus-visible:border-primary/50 h-12 font-mono tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full h-12 font-bold shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)] hover:shadow-[0_0_25px_-5px_rgba(var(--primary),0.6)] transition-all group mt-2" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Deploy Profile <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-all" />
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

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>
          </CardContent>
          
          <CardFooter className="justify-center bg-black/20 border-t border-white/5 py-4">
            <p className="text-xs text-muted-foreground">
              Already have clearance?{" "}
              <Link href="/auth/signin" className="text-primary font-semibold hover:underline">
                Initialize session
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
