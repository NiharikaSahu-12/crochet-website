-- =============================================
-- TheCozzyLoops - Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

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
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Authenticated users (admins) can do everything
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

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

-- Sample data (optional - remove if not needed)
-- INSERT INTO products (name, description, price, compare_price, category, stock_qty, status, is_featured, yarn_type, tags)
-- VALUES
--   ('Boho Market Bag', 'A beautiful handcrafted cotton market bag perfect for groceries or beach days.', 850, 1100, 'bags', 3, 'active', true, 'Cotton', ARRAY['boho', 'summer', 'gift']),
--   ('Mini Succulent Pot Cover', 'Cozy crochet cover for small plant pots. Adds warmth to your desk or shelf.', 350, NULL, 'home_decor', 5, 'active', true, 'Jute', ARRAY['home', 'plants', 'gift']),
--   ('Baby Lovey Blanket', 'Soft and snuggly lovey blanket for little ones. Made with baby-safe yarn.', 1200, NULL, 'baby', 2, 'active', true, 'Baby Soft Acrylic', ARRAY['baby', 'gift', 'nursery']);
