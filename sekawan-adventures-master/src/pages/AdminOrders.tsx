import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, Package, MapPin } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Rental {
  id: number;
  user_id: string;
  quantity: number;
  days: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface TripOrder {
  id: number;
  user_id: string;
  participants: number;
  total_price: number;
  status: string;
  created_at: string;
}

const AdminOrders = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [tripOrders, setTripOrders] = useState<TripOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rentals" | "trips">("rentals");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roles?.role !== "admin") {
      toast.error("Akses ditolak");
      navigate("/dashboard/customer");
      return;
    }

    fetchOrders();
  };

  const fetchOrders = async () => {
    const [rentalsRes, tripsRes] = await Promise.all([
      supabase.from("rentals").select("*").order("created_at", { ascending: false }),
      supabase.from("trip_orders").select("*").order("created_at", { ascending: false }),
    ]);

    if (rentalsRes.error || tripsRes.error) {
      toast.error("Gagal memuat data");
    }

    setRentals(rentalsRes.data || []);
    setTripOrders(tripsRes.data || []);
    setLoading(false);
  };

  const updateRentalStatus = async (id: number, status: string) => {
    const { error } = await supabase.from("rentals").update({ status }).eq("id", id);
    if (error) {
      toast.error("Gagal mengupdate status");
      return;
    }
    toast.success("Status berhasil diupdate");
    fetchOrders();
  };

  const updateTripOrderStatus = async (id: number, status: string) => {
    const { error } = await supabase.from("trip_orders").update({ status }).eq("id", id);
    if (error) {
      toast.error("Gagal mengupdate status");
      return;
    }
    toast.success("Status berhasil diupdate");
    fetchOrders();
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

  const statuses = ["pending", "confirmed", "completed", "cancelled"];

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
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Mountain className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground hidden sm:inline">Admin - Transaksi</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Manajemen Transaksi
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
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-foreground font-semibold">ID</th>
                      <th className="text-left p-4 text-foreground font-semibold">Tanggal</th>
                      <th className="text-left p-4 text-foreground font-semibold">Qty</th>
                      <th className="text-left p-4 text-foreground font-semibold">Durasi</th>
                      <th className="text-left p-4 text-foreground font-semibold">Total</th>
                      <th className="text-left p-4 text-foreground font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-muted-foreground">
                          Belum ada data penyewaan
                        </td>
                      </tr>
                    ) : (
                      rentals.map((rental) => (
                        <tr key={rental.id} className="border-t border-border hover:bg-secondary/30">
                          <td className="p-4 text-foreground font-mono">#{rental.id}</td>
                          <td className="p-4 text-muted-foreground">{formatDate(rental.created_at)}</td>
                          <td className="p-4 text-foreground">{rental.quantity}</td>
                          <td className="p-4 text-muted-foreground">{rental.days} hari</td>
                          <td className="p-4 text-accent font-medium">{formatPrice(rental.total_price)}</td>
                          <td className="p-4">
                            <Select
                              value={rental.status}
                              onValueChange={(value) => updateRentalStatus(rental.id, value)}
                            >
                              <SelectTrigger className={`w-32 ${getStatusColor(rental.status)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statuses.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-foreground font-semibold">ID</th>
                      <th className="text-left p-4 text-foreground font-semibold">Tanggal</th>
                      <th className="text-left p-4 text-foreground font-semibold">Peserta</th>
                      <th className="text-left p-4 text-foreground font-semibold">Total</th>
                      <th className="text-left p-4 text-foreground font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                          Belum ada data trip order
                        </td>
                      </tr>
                    ) : (
                      tripOrders.map((order) => (
                        <tr key={order.id} className="border-t border-border hover:bg-secondary/30">
                          <td className="p-4 text-foreground font-mono">#{order.id}</td>
                          <td className="p-4 text-muted-foreground">{formatDate(order.created_at)}</td>
                          <td className="p-4 text-foreground">{order.participants}</td>
                          <td className="p-4 text-accent font-medium">{formatPrice(order.total_price)}</td>
                          <td className="p-4">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateTripOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statuses.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrders;
