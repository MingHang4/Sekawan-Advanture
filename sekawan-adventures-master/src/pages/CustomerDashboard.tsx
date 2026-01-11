import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, Tent, MapPin, History, LogOut, User, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const CustomerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    
    setProfile(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { icon: Tent, label: "Katalog Alat", description: "Lihat & sewa peralatan outdoor", href: "/items" },
    { icon: MapPin, label: "Jadwal Trip", description: "Paket perjalanan adventure", href: "/trips" },
    { icon: ShoppingCart, label: "Keranjang", description: "Lihat item yang akan disewa", href: "/cart" },
    { icon: History, label: "Riwayat", description: "History penyewaan & trip", href: "/history" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Mountain className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Sekawan Adventure</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{profile?.full_name || user?.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=85&w=1800')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Selamat Datang, <span className="text-gradient-gold">{profile?.full_name?.split(' ')[0] || 'Petualang'}</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilih layanan yang Anda butuhkan untuk memulai petualangan outdoor Anda
            </p>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => (
              <Link 
                key={item.href}
                to={item.href}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{item.label}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Ringkasan Akun</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <div className="font-serif text-3xl font-bold text-accent mb-1">0</div>
                <div className="text-sm text-muted-foreground">Penyewaan Aktif</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <div className="font-serif text-3xl font-bold text-accent mb-1">0</div>
                <div className="text-sm text-muted-foreground">Trip Terdaftar</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-secondary/50">
                <div className="font-serif text-3xl font-bold text-accent mb-1">0</div>
                <div className="text-sm text-muted-foreground">Total Transaksi</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;
