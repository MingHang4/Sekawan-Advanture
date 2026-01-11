-- Insert demo items (peralatan sewa outdoor)
INSERT INTO public.items (name, description, category, price, stock, image) VALUES
('Tenda Dome 4 Orang', 'Tenda kapasitas 4 orang dengan waterproof coating, cocok untuk camping keluarga', 'Tenda', 75000, 10, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'),
('Tenda Ultralight 2 Orang', 'Tenda ringan untuk hiking, mudah dibawa dengan berat hanya 1.5kg', 'Tenda', 50000, 15, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400'),
('Sleeping Bag -5°C', 'Sleeping bag dengan rating suhu -5°C, cocok untuk pendakian gunung tinggi', 'Sleeping Gear', 35000, 20, 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=400'),
('Sleeping Bag 10°C', 'Sleeping bag nyaman untuk camping di dataran rendah', 'Sleeping Gear', 25000, 25, 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=400'),
('Carrier 60L', 'Tas gunung 60 liter dengan frame ergonomis dan rain cover', 'Tas', 45000, 12, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Carrier 40L', 'Tas hiking 40 liter cocok untuk day hike atau weekend trip', 'Tas', 30000, 18, 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400'),
('Matras Foam', 'Matras tidur foam tebal 2cm untuk kenyamanan maksimal', 'Sleeping Gear', 15000, 30, 'https://images.unsplash.com/photo-1476673160081-cf065f89c9a6?w=400'),
('Kompor Portable', 'Kompor gas portable dengan windshield, efisien bahan bakar', 'Cooking', 20000, 15, 'https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=400'),
('Cooking Set', 'Set masak camping lengkap untuk 4 orang', 'Cooking', 25000, 12, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Headlamp LED', 'Headlamp 300 lumens dengan 3 mode cahaya, tahan air', 'Lighting', 15000, 25, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400'),
('Trekking Pole', 'Trekking pole aluminium adjustable, sepasang', 'Accessories', 20000, 20, 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'),
('Hammock', 'Hammock parasut dengan tali dan carabiner', 'Accessories', 25000, 15, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400');

-- Insert demo trips (paket wisata)
INSERT INTO public.trips (title, description, destination, date, duration_days, price, quota, image) VALUES
('Pendakian Gunung Rinjani', 'Ekspedisi 4 hari 3 malam ke puncak Gunung Rinjani via Senaru dengan pemandangan Danau Segara Anak yang menakjubkan', 'Lombok, NTB', '2025-01-15', 4, 2500000, 15, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400'),
('Camping Bromo Sunrise', 'Trip 2 hari 1 malam camping di Penanjakan untuk menikmati sunrise Bromo yang legendaris', 'Probolinggo, Jawa Timur', '2025-01-20', 2, 850000, 20, 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400'),
('Rafting Sungai Elo', 'Petualangan arung jeram 12km di Sungai Elo dengan rapids grade 2-3, cocok untuk pemula', 'Magelang, Jawa Tengah', '2025-01-25', 1, 350000, 25, 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=400'),
('Snorkeling Karimunjawa', 'Trip 3 hari 2 malam snorkeling di spot terbaik Karimunjawa dengan akomodasi homestay', 'Jepara, Jawa Tengah', '2025-02-01', 3, 1800000, 12, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'),
('Pendakian Gunung Semeru', 'Ekspedisi 3 hari 2 malam ke Mahameru, puncak tertinggi Pulau Jawa', 'Lumajang, Jawa Timur', '2025-02-10', 3, 1500000, 10, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'),
('Camping Kawah Ijen', 'Trip 2 hari 1 malam melihat blue fire dan sunrise di Kawah Ijen', 'Banyuwangi, Jawa Timur', '2025-02-15', 2, 750000, 18, 'https://images.unsplash.com/photo-1580077989132-8ed27b8e2c32?w=400'),
('Trekking Gunung Prau', 'Trip 2 hari 1 malam ke Gunung Prau dengan pemandangan golden sunrise', 'Dieng, Jawa Tengah', '2025-02-20', 2, 650000, 20, 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400'),
('Island Hopping Raja Ampat', 'Trip 5 hari 4 malam menjelajahi kepulauan Raja Ampat dengan diving dan snorkeling', 'Raja Ampat, Papua Barat', '2025-03-01', 5, 8500000, 8, 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400');