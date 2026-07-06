import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, Package, MapPin } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Rental {
  id: number;
  quantity: number;
  days: number;
  total_price: number;
  status: string;
  created_at: string;
  items: { name: string; image: string | null } | null;
}

interface TripOrder {
  id: number;
  participants: number;
  total_price: number;
  status: string;
  created_at: string;
  trips: { title: string; image: string | null; destination: string | null } | null;
}

const HistoryPage = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tripOrders, setTripOrders] = useState<TripOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rentals" | "trips">("rentals");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchHistory(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchHistory = async (userId: string) => {
    const [rentalsRes, tripsRes] = await Promise.all([
      supabase.from("rentals").select("*, items(name, image)").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("trip_orders").select("*, trips(title, image, destination)").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);

    if (rentalsRes.error || tripsRes.error) {
      toast.error("Gagal memuat data");
    }

    setRentals(rentalsRes.data || []);
    setTripOrders(tripsRes.data || []);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "d MMM yyyy, HH:mm", { locale: id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-accent/20 text-accent";
      case "cancelled":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-secondary text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/customer")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Mountain className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground hidden sm:inline">Sekawan Adventure</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Riwayat Pemesanan
          </h1>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === "rentals" ? "gold" : "outline"}
              onClick={() => setActiveTab("rentals")}
              className="gap-2"
            >
              <Package className="w-4 h-4" />
              Penyewaan ({rentals.length})
            </Button>
            <Button
              variant={activeTab === "trips" ? "gold" : "outline"}
              onClick={() => setActiveTab("trips")}
              className="gap-2"
            >
              <MapPin className="w-4 h-4" />
              Trip ({tripOrders.length})
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {activeTab === "rentals" ? (
            rentals.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Belum ada riwayat penyewaan</p>
                <Link to="/items">
                  <Button variant="gold" className="mt-4">Sewa Peralatan</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {rentals.map((rental) => (
                  <div key={rental.id} className="glass-card rounded-xl p-4 flex gap-4">
                    <img
                      src={rental.items?.image || "https://images.unsplash.com/photo-1520872024865-1c2a4d1c3e1a?q=85&w=200"}
                      alt={rental.items?.name || "Item"}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground">
                            {rental.items?.name || "Item"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {rental.days} hari • {formatDate(rental.created_at)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status || "pending")}`}>
                          {rental.status || "pending"}
                        </span>
                      </div>
                      <div className="mt-2 text-accent font-bold">{formatPrice(rental.total_price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            tripOrders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">Belum ada riwayat trip</p>
                <Link to="/trips">
                  <Button variant="gold" className="mt-4">Lihat Trip</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tripOrders.map((order) => (
                  <div key={order.id} className="glass-card rounded-xl p-4 flex gap-4">
                    <img
                      src={order.trips?.image || "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f4?q=85&w=200"}
                      alt={order.trips?.title || "Trip"}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground">
                            {order.trips?.title || "Trip"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.trips?.destination} • {order.participants} peserta • {formatDate(order.created_at)}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || "pending")}`}>
                          {order.status || "pending"}
                        </span>
                      </div>
                      <div className="mt-2 text-accent font-bold">{formatPrice(order.total_price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
