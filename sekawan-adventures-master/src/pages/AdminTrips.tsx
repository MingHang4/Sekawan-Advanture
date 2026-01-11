import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

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

const AdminTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination: "",
    date: "",
    duration_days: "",
    quota: "",
    price: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
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

    fetchTrips();
  };

  const fetchTrips = async () => {
    const { data, error } = await supabase.from("trips").select("*").order("date", { ascending: true });
    if (error) {
      toast.error("Gagal memuat data");
      return;
    }
    setTrips(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const tripData = {
      title: formData.title,
      description: formData.description || null,
      destination: formData.destination || null,
      date: formData.date || null,
      duration_days: parseInt(formData.duration_days) || 1,
      quota: parseInt(formData.quota) || 0,
      price: parseInt(formData.price) || 0,
      image: formData.image || null,
    };

    if (editingTrip) {
      const { error } = await supabase
        .from("trips")
        .update(tripData)
        .eq("id", editingTrip.id);

      if (error) {
        toast.error("Gagal mengupdate trip");
        setSaving(false);
        return;
      }
      toast.success("Trip berhasil diupdate");
    } else {
      const { error } = await supabase.from("trips").insert(tripData);

      if (error) {
        toast.error("Gagal menambah trip");
        setSaving(false);
        return;
      }
      toast.success("Trip berhasil ditambah");
    }

    setDialogOpen(false);
    resetForm();
    fetchTrips();
    setSaving(false);
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      title: trip.title,
      description: trip.description || "",
      destination: trip.destination || "",
      date: trip.date || "",
      duration_days: trip.duration_days?.toString() || "",
      quota: trip.quota.toString(),
      price: trip.price.toString(),
      image: trip.image || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus trip ini?")) return;

    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus trip");
      return;
    }
    toast.success("Trip berhasil dihapus");
    fetchTrips();
  };

  const resetForm = () => {
    setEditingTrip(null);
    setFormData({
      title: "",
      description: "",
      destination: "",
      date: "",
      duration_days: "",
      quota: "",
      price: "",
      image: "",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/admin")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="font-serif text-xl font-semibold text-foreground hidden sm:inline">Admin - Trip</span>
              </Link>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button variant="gold" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Tambah Trip
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-foreground">
                    {editingTrip ? "Edit Trip" : "Tambah Trip Baru"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Judul Trip</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Deskripsi</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Destinasi</Label>
                    <Input
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Gunung Rinjani, Lombok"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Tanggal</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Durasi (hari)</Label>
                      <Input
                        type="number"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Kuota</Label>
                      <Input
                        type="number"
                        value={formData.quota}
                        onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                        required
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Harga (Rp)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">URL Gambar</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://..."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingTrip ? "Update" : "Simpan")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Trips Table */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-foreground font-semibold">Trip</th>
                    <th className="text-left p-4 text-foreground font-semibold">Destinasi</th>
                    <th className="text-left p-4 text-foreground font-semibold">Tanggal</th>
                    <th className="text-left p-4 text-foreground font-semibold">Harga</th>
                    <th className="text-left p-4 text-foreground font-semibold">Kuota</th>
                    <th className="text-right p-4 text-foreground font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={trip.image || "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f4?q=85&w=100"}
                            alt={trip.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-foreground">{trip.title}</div>
                            <div className="text-sm text-muted-foreground">{trip.duration_days} hari</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{trip.destination || "-"}</td>
                      <td className="p-4 text-muted-foreground">
                        {trip.date ? format(new Date(trip.date), "dd/MM/yyyy") : "-"}
                      </td>
                      <td className="p-4 text-accent font-medium">{formatPrice(trip.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          trip.quota < 5 ? "bg-accent/20 text-accent" : "bg-green-500/20 text-green-400"
                        }`}>
                          {trip.quota}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(trip)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(trip.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminTrips;
