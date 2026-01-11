import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useSeeder } from "@/hooks/useSeeder";

interface Item {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string | null;
}

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();
  const { addItem, totalItems } = useCart();

  useSeeder();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchItems();
    };
    checkAuth();
  }, [navigate]);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("name");
    
    if (error) {
      toast.error("Gagal memuat data");
      return;
    }
    setItems(data || []);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: Item) => {
    if (item.stock === 0) return;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: item.stock,
    });
    toast.success(`${item.name} ditambahkan ke keranjang`);
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
            <Link to="/cart">
              <Button variant="gold" className="relative gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Keranjang</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            Katalog Peralatan
          </h1>
          <p className="text-muted-foreground">
            Pilih peralatan outdoor berkualitas untuk petualangan Anda
          </p>
        </div>
      </section>

      {/* Items Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Belum ada peralatan tersedia</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1520872024865-1c2a4d1c3e1a?q=85&w=800"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    {item.stock < 3 && item.stock > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-medium">
                        Stok Terbatas
                      </span>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <span className="text-foreground font-medium">Stok Habis</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {item.category && (
                      <span className="text-xs text-accent font-medium uppercase tracking-wider">{item.category}</span>
                    )}
                    <h3 className="font-serif text-lg font-semibold text-foreground mt-1 mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{item.description || "Peralatan outdoor berkualitas tinggi"}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-accent font-bold">{formatPrice(item.price)}</div>
                        <div className="text-xs text-muted-foreground">per hari • Stok: {item.stock}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl text-foreground">{selectedItem.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img
                    src={selectedItem.image || "https://images.unsplash.com/photo-1520872024865-1c2a4d1c3e1a?q=85&w=800"}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {selectedItem.category && (
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                      {selectedItem.category}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedItem.stock > 0 ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
                  }`}>
                    Stok: {selectedItem.stock}
                  </span>
                </div>
                <p className="text-muted-foreground">{selectedItem.description || "Peralatan outdoor berkualitas tinggi untuk petualangan Anda."}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-2xl font-bold text-accent">{formatPrice(selectedItem.price)}</div>
                    <div className="text-sm text-muted-foreground">per hari</div>
                  </div>
                  <Button
                    variant="gold"
                    size="lg"
                    disabled={selectedItem.stock === 0}
                    onClick={() => {
                      handleAddToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                  >
                    {selectedItem.stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
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

export default ItemsPage;
