-- =============================================
-- TheCozzyLoops - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  stock_qty INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  yarn_type TEXT,
  color_options TEXT[] DEFAULT '{}',
  care_instructions TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Authenticated users (admins) can do everything with categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public can read active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Storage Bucket for product images
-- Run this in Supabase Dashboard > Storage or use the SQL editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT DO NOTHING;

-- Storage policy: Public read
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Storage policy: Admin upload
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Storage policy: Admin delete
CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Default categories
INSERT INTO categories (value, label, description, sort_order, is_active)
VALUES
  ('flowers', 'Crochet Flowers', 'Single crochet stems and floral keepsakes.', 1, true),
  ('bouquets', 'Crochet Bouquets', 'Gift-ready handmade bouquets.', 2, true),
  ('keychains', 'Crochet Keychains', 'Small charms and everyday accessories.', 3, true),
  ('scrunchies', 'Crochet Scrunchies', 'Soft handmade hair accessories.', 4, true),
  ('gifts', 'Handmade Gifts', 'Personalized crochet gifts.', 5, true),
  ('custom', 'Custom Orders', 'Made-to-order crochet requests.', 6, true)
ON CONFLICT (value) DO NOTHING;
