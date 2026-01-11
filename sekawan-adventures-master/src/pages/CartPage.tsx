import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mountain, ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    if (items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setCheckingOut(true);

    try {
      // Create rental records for each item
      const rentals = items.map((item) => ({
        user_id: session.user.id,
        item_id: item.id,
        quantity: item.quantity,
        days: item.quantity, // days = quantity as per requirements
        total_price: item.price * item.quantity,
        status: "pending",
      }));

      const { error } = await supabase.from("rentals").insert(rentals);

      if (error) throw error;

      clearCart();
      toast.success("Checkout berhasil! Pesanan Anda sedang diproses.");
      navigate("/history");
    } catch (error) {
      console.error(error);
      toast.error("Gagal melakukan checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
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

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">
            Keranjang Penyewaan
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Keranjang Kosong</h2>
              <p className="text-muted-foreground mb-6">Belum ada item yang ditambahkan ke keranjang</p>
              <Link to="/items">
                <Button variant="gold">Lihat Katalog</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="glass-card rounded-xl p-4 flex gap-4">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1520872024865-1c2a4d1c3e1a?q=85&w=200"}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigate("/items")}
                    />
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{item.name}</h3>
                      <p className="text-accent font-medium">{formatPrice(item.price)}/hari</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center text-foreground font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground ml-2">hari</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-foreground font-bold">{formatPrice(item.price * item.quantity)}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card rounded-xl p-6 sticky top-24">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Ringkasan Pesanan</h2>
                  
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.name} x {item.quantity} hari</span>
                        <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-foreground font-semibold">Total</span>
                      <span className="text-accent font-bold text-xl">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    variant="gold"
                    className="w-full mb-2"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Memproses...
                      </>
                    ) : (
                      "Checkout"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      const waNumber = '6287781230443'; // Nomor admin WA
                      const pesan = [
                        '*PESANAN SEWA PERALATAN SEKAWAN ADVENTURE*',
                        '',
                        'Detail Pesanan:',
                        ...items.map((item, i) => `• ${item.name} x ${item.quantity} hari = ${formatPrice(item.price * item.quantity)}`),
                        '',
                        `Total: ${formatPrice(totalPrice)}`,
                        '',
                        'Mohon konfirmasi ketersediaan alat dan langkah pembayaran. Terima kasih.',
                        '',
                        'Nama: ______',
                        'Tanggal sewa: ______',
                        'Catatan: ______',
                      ].join('\n');
                      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(pesan)}`;
                      window.open(url, '_blank');
                    }}
                    disabled={items.length === 0}
                  >
                    Checkout via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
