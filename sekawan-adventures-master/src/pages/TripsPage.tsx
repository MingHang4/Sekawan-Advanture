import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, Calendar, Users, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSeeder } from "@/hooks/useSeeder";

interface Trip {
  id: number;
  title: string;
  description: string | null;
  destination: string | null;
  date: string | null;
  duration_days: number | null;
  quota: number;
  price: number;
  image: string | null;
}

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  useSeeder();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchTrips();
    };
    checkAuth();
  }, [navigate]);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("date", { ascending: true });
    
    if (error) {
      toast.error("Gagal memuat data");
      return;
    }
    setTrips(data || []);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Tanggal belum ditentukan";
    return format(new Date(dateStr), "d MMMM yyyy", { locale: id });
  };

  const handleBookTrip = async (trip: Trip) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setBooking(true);

    const { error } = await supabase.from("trip_orders").insert({
      user_id: session.user.id,
      trip_id: trip.id,
      participants: 1,
      total_price: trip.price,
      status: "pending",
    });

    setBooking(false);

    if (error) {
      toast.error("Gagal mendaftar trip");
      return;
    }

    toast.success("Berhasil mendaftar trip!");
    setSelectedTrip(null);
    navigate("/history");
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
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Jadwal Trip Adventure
          </h1>
          <p className="text-muted-foreground">
            Pilih paket perjalanan dan jelajahi alam Indonesia bersama kami
          </p>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {trips.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Belum ada trip tersedia</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={trip.image || "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f4?q=85&w=1200"}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                        {formatPrice(trip.price)}/orang
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">{trip.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{trip.description || "Petualangan seru menanti Anda"}</p>
                    
                    <div className="space-y-2">
                      {trip.destination && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{trip.destination}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{formatDate(trip.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4 text-accent" />
                        <span>{trip.quota} slot tersedia</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trip Detail Modal */}
      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground">{selectedTrip.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={selectedTrip.image || "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f4?q=85&w=1200"}
                    alt={selectedTrip.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {selectedTrip.destination && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-accent" />
                      <span>{selectedTrip.destination}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5 text-accent" />
                    <span>{formatDate(selectedTrip.date)}</span>
                  </div>
                  {selectedTrip.duration_days && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5 text-accent" />
                      <span>{selectedTrip.duration_days} hari</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5 text-accent" />
                    <span>{selectedTrip.quota} slot tersedia</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{selectedTrip.description || "Petualangan seru menanti Anda dengan pemandu profesional dan pengalaman tak terlupakan."}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-accent">{formatPrice(selectedTrip.price)}</div>
                    <div className="text-sm text-muted-foreground">per orang</div>
                  </div>
                  <Button
                    variant="gold"
                    size="lg"
                    disabled={selectedTrip.quota === 0 || booking}
                    onClick={() => handleBookTrip(selectedTrip)}
                  >
                    {booking ? "Memproses..." : selectedTrip.quota === 0 ? "Kuota Penuh" : "Pesan Trip"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripsPage;
