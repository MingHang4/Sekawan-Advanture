import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Mountain, Tent, MapPin, Shield, Users, Award, ChevronRight, Compass, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Mountain className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold text-foreground">Sekawan Adventure</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-muted-foreground hover:text-accent transition-colors">Layanan</a>
              <a href="#about" className="text-muted-foreground hover:text-accent transition-colors">Tentang</a>
              <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">Kontak</a>
            </div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground flex items-center gap-1"><User className="w-4 h-4" />{user.email}</span>
                <Button variant="gold" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="gold" size="sm">Masuk</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1800')"
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-medium mb-8">
              <Compass className="w-4 h-4" />
              Petualangan Premium Sejak 2015
            </span>
          </div>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 animate-slide-up">
            Sekawan
            <span className="block text-gradient-gold">Adventure</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
            Penyewaan alat pendakian & trip outdoor dengan kualitas premium. 
            Jelajahi alam Indonesia bersama tim profesional kami.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <Link to="/auth">
              <Button variant="hero" size="xl">
                Mulai Petualangan
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="hero-outline" size="xl">
                Lihat Layanan
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 rounded-full bg-accent" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-forest">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent text-sm font-semibold tracking-wider uppercase">Layanan Kami</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-4">
              Peralatan & Trip Premium
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 - Clickable to /items */}
            <Link to="/items" className="group relative rounded-2xl overflow-hidden cursor-pointer block">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1500048993959-dcfe0c0cfdab?q=85&w=1800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative p-8 pt-48">
                <div className="w-14 h-14 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center mb-4">
                  <Tent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Sewa Peralatan</h3>
                <p className="text-muted-foreground">Tenda, sleeping bag, carrier, dan perlengkapan outdoor berkualitas tinggi untuk pendakian Anda.</p>
                <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                  <span>Lihat Katalog</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Service Card 2 - Clickable to /trips */}
            <Link to="/trips" className="group relative rounded-2xl overflow-hidden cursor-pointer block">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=85&w=1800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative p-8 pt-48">
                <div className="w-14 h-14 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Trip Adventure</h3>
                <p className="text-muted-foreground">Paket perjalanan ke gunung-gunung indah Indonesia dengan pemandu profesional berpengalaman.</p>
                <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                  <span>Lihat Jadwal</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Service Card 3 - Clickable to /trips */}
            <Link to="/trips" className="group relative rounded-2xl overflow-hidden cursor-pointer block md:col-span-2 lg:col-span-1">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=85&w=1800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="relative p-8 pt-48">
                <div className="w-14 h-14 rounded-xl bg-accent/20 backdrop-blur flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Private Group</h3>
                <p className="text-muted-foreground">Atur perjalanan pribadi dengan tim Anda. Fleksibel, personal, dan tak terlupakan.</p>
                <div className="mt-4 flex items-center gap-2 text-accent font-medium">
                  <span>Hubungi Kami</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-forest-light/20" />
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">Mengapa Kami?</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
                Pengalaman Terbaik untuk Petualangan Anda
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Dengan pengalaman lebih dari 8 tahun, kami telah membantu ribuan pendaki mewujudkan mimpi mereka menjelajahi puncak-puncak tertinggi Indonesia.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Keamanan Terjamin</h4>
                    <p className="text-muted-foreground text-sm">Semua peralatan terawat dengan standar keselamatan tinggi</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Tim Profesional</h4>
                    <p className="text-muted-foreground text-sm">Pemandu bersertifikat dengan pengalaman bertahun-tahun</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Kualitas Premium</h4>
                    <p className="text-muted-foreground text-sm">Hanya menggunakan brand outdoor terpercaya dunia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=85&w=1800" 
                  alt="Mountain adventure"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-6 shadow-elevated">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-serif text-3xl font-bold text-accent">500+</div>
                    <div className="text-xs text-muted-foreground">Trip Sukses</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="font-serif text-3xl font-bold text-accent">2000+</div>
                    <div className="text-xs text-muted-foreground">Pelanggan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=85&w=1800')"
          }}
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        
        <div className="container mx-auto px-6 relative text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Siap Memulai Petualangan?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
            Daftar sekarang dan dapatkan akses ke katalog peralatan premium serta jadwal trip eksklusif kami.
          </p>
          <Link to="/auth">
            <Button variant="hero" size="xl">
              Daftar Sekarang
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Mountain className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="font-serif text-xl font-semibold text-foreground">Sekawan Adventure</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Penyedia layanan outdoor terpercaya di Indonesia. Sewa peralatan berkualitas dan ikuti trip adventure bersama kami.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Layanan</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/items" className="hover:text-accent transition-colors">Sewa Peralatan</Link></li>
                <li><Link to="/trips" className="hover:text-accent transition-colors">Trip Adventure</Link></li>
                <li><Link to="/auth" className="hover:text-accent transition-colors">Private Group</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>info@sekawan.adventure</li>
                <li>+62 812 3456 7890</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
            © 2024 Sekawan Adventure. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
