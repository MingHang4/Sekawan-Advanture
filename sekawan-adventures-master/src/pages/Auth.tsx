import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  fullName: z.string().min(2, "Nama minimal 2 karakter").optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastAuthDebug, setLastAuthDebug] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        checkUserRoleAndRedirect(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserRoleAndRedirect(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoleAndRedirect = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roles?.role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/customer");
    }
  };

  const validateForm = () => {
    try {
      if (isLogin) {
        authSchema.pick({ email: true, password: true }).parse({ email, password });
      } else {
        authSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        setLastAuthDebug(JSON.stringify({ data, error }, null, 2));
        if (error) throw error;
        toast.success("Berhasil masuk!");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });
        console.log("signUp response:", data, error);
        setLastAuthDebug(JSON.stringify({ data, error }, null, 2));
        if (error) throw error;
        // Insert default role for new users so app can redirect correctly after verification/login
        try {
          const userId = data?.user?.id;
          if (userId) {
            const { error: roleErr } = await supabase.from("user_roles").insert({
              user_id: userId,
              role: "customer",
            });
            if (roleErr) console.error("Failed to insert user_roles:", roleErr);
          }
        } catch (e) {
          console.error("Error inserting user_roles:", e);
        }

        toast.success("Akun berhasil dibuat! Silakan cek email untuk verifikasi.");
      }
    } catch (err) {
      let message = "Terjadi kesalahan";
      console.error("Auth error:", err);
      if (err instanceof Error) {
        const errorMsg = err.message;
        // Show the raw error message for easier debugging while keeping localized fallbacks
        message = errorMsg || message;
        if (errorMsg.includes("Invalid login")) {
          message = "Email atau password salah";
        } else if (errorMsg.includes("already registered")) {
          message = "Email sudah terdaftar";
        } else if (errorMsg.includes("Password")) {
          message = "Password tidak memenuhi syarat";
        }
      } else if (typeof err === "string") {
        message = err;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?q=85&w=1800')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Mountain className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Sekawan Adventure</span>
          </Link>
          
          <div>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Jelajahi Alam Indonesia
            </h2>
            <p className="text-muted-foreground max-w-md">
              Bergabunglah dengan ribuan petualang lainnya. Sewa peralatan berkualitas dan ikuti trip adventure eksklusif.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Mountain className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Sekawan Adventure</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Selamat Datang" : "Buat Akun Baru"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "Masuk ke akun Anda untuk melanjutkan" : "Daftar untuk memulai petualangan"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Nama Lengkap</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-secondary border-border focus:border-accent"
                />
                {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="bg-secondary border-border focus:border-accent"
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border focus:border-accent pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>

            <Button 
              type="submit" 
              variant="gold" 
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                isLogin ? "Masuk" : "Daftar"
              )}
            </Button>
          </form>

          {lastAuthDebug && (
            <div className="mt-6 p-4 bg-secondary rounded-md text-sm text-foreground">
              <div className="font-medium mb-2">Debug info (signUp / signIn response)</div>
              <pre className="whitespace-pre-wrap text-xs">{lastAuthDebug}</pre>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-accent hover:underline ml-2 font-medium"
              >
                {isLogin ? "Daftar" : "Masuk"}
              </button>
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi kami.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
