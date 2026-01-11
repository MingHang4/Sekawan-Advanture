import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const sampleItems = [
  {
    name: "Tenda Dome 4 Orang",
    description: "Tenda berkualitas tinggi untuk 4 orang dengan waterproof 3000mm",
    price: 75000,
    stock: 10,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=85&w=800",
    category: "Tenda",
  },
  {
    name: "Carrier 60L Deuter",
    description: "Tas gunung kapasitas 60 liter dengan frame ergonomis",
    price: 50000,
    stock: 15,
    image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?q=85&w=800",
    category: "Carrier",
  },
  {
    name: "Sleeping Bag -5°C",
    description: "Sleeping bag tahan suhu hingga -5 derajat Celsius",
    price: 35000,
    stock: 20,
    image: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?q=85&w=800",
    category: "Sleeping Bag",
  },
];

const sampleTrips = [
  {
    title: "Pendakian Gunung Rinjani",
    description: "Trip 4 hari 3 malam ke puncak tertinggi kedua Indonesia dengan pemandangan Danau Segara Anak yang memukau",
    destination: "Lombok, NTB",
    date: "2025-01-15",
    duration_days: 4,
    quota: 15,
    price: 2500000,
    image: "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=85&w=800",
  },
  {
    title: "Ekspedisi Gunung Semeru",
    description: "Pendakian ke atap Pulau Jawa dengan sunrise spektakuler di Mahameru",
    destination: "Lumajang, Jawa Timur",
    date: "2025-02-01",
    duration_days: 3,
    quota: 20,
    price: 1800000,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=85&w=800",
  },
];

export const useSeeder = () => {
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    const seedData = async () => {
      // Check and seed items
      const { data: items } = await supabase.from("items").select("id").limit(1);
      if (!items || items.length === 0) {
        await supabase.from("items").insert(sampleItems);
        console.log("Seeded items");
      }

      // Check and seed trips
      const { data: trips } = await supabase.from("trips").select("id").limit(1);
      if (!trips || trips.length === 0) {
        await supabase.from("trips").insert(sampleTrips);
        console.log("Seeded trips");
      }
    };

    seedData();
  }, []);
};
