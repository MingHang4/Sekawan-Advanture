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

interface Item {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string | null;
}

const AdminItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
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

    fetchItems();
  };

  const fetchItems = async () => {
    const { data, error } = await supabase.from("items").select("*").order("name");
    if (error) {
      toast.error("Gagal memuat data");
      return;
    }
    setItems(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const itemData = {
      name: formData.name,
      description: formData.description || null,
      price: parseInt(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      image: formData.image || null,
      category: formData.category || null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("items")
        .update(itemData)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Gagal mengupdate item");
        setSaving(false);
        return;
      }
      toast.success("Item berhasil diupdate");
    } else {
      const { error } = await supabase.from("items").insert(itemData);

      if (error) {
        toast.error("Gagal menambah item");
        setSaving(false);
        return;
      }
      toast.success("Item berhasil ditambah");
    }

    setDialogOpen(false);
    resetForm();
    fetchItems();
    setSaving(false);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      stock: item.stock.toString(),
      image: item.image || "",
      category: item.category || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus item ini?")) return;

    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus item");
      return;
    }
    toast.success("Item berhasil dihapus");
    fetchItems();
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      image: "",
      category: "",
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
                <span className="font-serif text-xl font-semibold text-foreground hidden sm:inline">Admin - Alat</span>
              </Link>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button variant="gold" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Tambah Item
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="font-serif text-foreground">
                    {editingItem ? "Edit Item" : "Tambah Item Baru"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Nama Item</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Harga (Rp/hari)</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Stok</Label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                  <div className="space-y-2">
                    <Label className="text-foreground">Kategori</Label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Tenda, Carrier, dll"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button type="submit" variant="gold" className="w-full" disabled={saving}>
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingItem ? "Update" : "Simpan")}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </nav>

      {/* Items Table */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-foreground font-semibold">Item</th>
                    <th className="text-left p-4 text-foreground font-semibold">Kategori</th>
                    <th className="text-left p-4 text-foreground font-semibold">Harga</th>
                    <th className="text-left p-4 text-foreground font-semibold">Stok</th>
                    <th className="text-right p-4 text-foreground font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1520872024865-1c2a4d1c3e1a?q=85&w=100"}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{item.category || "-"}</td>
                      <td className="p-4 text-accent font-medium">{formatPrice(item.price)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.stock < 3 ? "bg-destructive/20 text-destructive" : "bg-green-500/20 text-green-400"
                        }`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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

export default AdminItems;
