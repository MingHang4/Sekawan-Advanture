import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, Package, MapPin, ShoppingBag, Users, LogOut, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [user, setUser] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalTrips: 0,
    totalRentals: 0,
    totalUsers: 0,
    lowStock: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roles?.role !== "admin") {
      toast.error("Akses ditolak. Anda bukan admin.");
      navigate("/dashboard/customer");
      return;
    }

    fetchStats();
    setLoading(false);
  };

  const fetchStats = async () => {
    const [items, trips, rentals, profiles] = await Promise.all([
      supabase.from("items").select("id, stock"),
      supabase.from("trips").select("id"),
      supabase.from("rentals").select("id"),
      supabase.from("profiles").select("id"),
    ]);

    setStats({
      totalItems: items.data?.length || 0,
      totalTrips: trips.data?.length || 0,
      totalRentals: rentals.data?.length || 0,
      totalUsers: profiles.data?.length || 0,
      lowStock: items.data?.filter(i => i.stock < 3).length || 0,
    });
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
    { icon: Package, label: "Kelola Alat", description: "CRUD peralatan outdoor", href: "/admin/items", count: stats.totalItems },
    { icon: MapPin, label: "Kelola Trip", description: "CRUD jadwal perjalanan", href: "/admin/trips", count: stats.totalTrips },
    { icon: ShoppingBag, label: "Transaksi", description: "Kelola pesanan & penyewaan", href: "/admin/orders", count: stats.totalRentals },
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
              <span className="font-serif text-xl font-semibold text-foreground">Sekawan Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                Administrator
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-12 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=85&w=1800')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        
        <div className="container mx-auto px-6 relative">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">
            Kelola sistem penyewaan dan trip Sekawan Adventure
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{stats.totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Peralatan</div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{stats.totalTrips}</div>
              <div className="text-sm text-muted-foreground">Total Trip</div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{stats.totalRentals}</div>
              <div className="text-sm text-muted-foreground">Total Penyewaan</div>
            </div>

            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-serif text-3xl font-bold text-foreground">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">Total Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* Alert */}
      {stats.lowStock > 0 && (
        <section className="py-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="text-foreground">
                <strong>{stats.lowStock}</strong> item dengan stok menipis (kurang dari 3)
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Menu Grid */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Menu Manajemen</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                to={item.href}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-gold"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <item.icon className="w-7 h-7 text-accent" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium">
                    {item.count}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{item.label}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
