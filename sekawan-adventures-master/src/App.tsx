import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ItemsPage from "./pages/ItemsPage";
import TripsPage from "./pages/TripsPage";
import CartPage from "./pages/CartPage";
import HistoryPage from "./pages/HistoryPage";
import AdminItems from "./pages/AdminItems";
import AdminTrips from "./pages/AdminTrips";
import AdminOrders from "./pages/AdminOrders";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin/items" element={<AdminItems />} />
          <Route path="/admin/trips" element={<AdminTrips />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
