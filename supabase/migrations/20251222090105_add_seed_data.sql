/*
  # Seed Data for Furniture E-commerce Platform

  ## Overview
  This migration adds sample data for demonstration purposes including:
  - 4 furniture categories
  - 16 sample furniture products with images from Pexels
  - Products distributed across different categories
  - Mix of featured and regular products

  ## Categories Added
  1. Living Room - Sofas, chairs, coffee tables
  2. Bedroom - Beds, dressers, nightstands
  3. Dining - Dining tables, chairs, cabinets
  4. Office - Desks, office chairs, bookshelves

  ## Products Added
  - Each category has 4 products
  - All products include high-quality stock photos
  - Varied price points from $299 to $2,499
  - Different stock levels for realistic demo
  - Some products marked as featured

  ## Important Notes
  - All image URLs are from Pexels (free to use)
  - Product slugs are URL-friendly
  - Stock quantities vary to demonstrate inventory management
  - Featured flag set on select products for homepage display
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Living Room', 'living-room', 'Comfortable and stylish furniture for your living space', 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Bedroom', 'bedroom', 'Create your perfect sanctuary with our bedroom collection', 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Dining', 'dining', 'Gather together with beautiful dining furniture', 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800'),
('Office', 'office', 'Productive and comfortable workspace furniture', 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  living_room_id uuid;
  bedroom_id uuid;
  dining_id uuid;
  office_id uuid;
BEGIN
  SELECT id INTO living_room_id FROM categories WHERE slug = 'living-room';
  SELECT id INTO bedroom_id FROM categories WHERE slug = 'bedroom';
  SELECT id INTO dining_id FROM categories WHERE slug = 'dining';
  SELECT id INTO office_id FROM categories WHERE slug = 'office';

  -- Insert Living Room Products
  INSERT INTO products (name, slug, description, price, category_id, images, stock, featured) VALUES
  ('Modern Velvet Sofa', 'modern-velvet-sofa', 'Luxurious 3-seater sofa with plush velvet upholstery and solid wood frame. Perfect centerpiece for any living room.', 1299.99, living_room_id, '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200", "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 15, true),
  ('Minimalist Coffee Table', 'minimalist-coffee-table', 'Sleek oak coffee table with clean lines and spacious surface. Includes lower shelf for storage.', 449.99, living_room_id, '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 25, true),
  ('Accent Armchair', 'accent-armchair', 'Comfortable accent chair with mid-century design. Features curved armrests and tapered wooden legs.', 599.99, living_room_id, '["https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 20, false),
  ('TV Stand Cabinet', 'tv-stand-cabinet', 'Contemporary TV stand with ample storage. Fits TVs up to 65 inches with cable management system.', 379.99, living_room_id, '["https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 18, false)
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Bedroom Products
  INSERT INTO products (name, slug, description, price, category_id, images, stock, featured) VALUES
  ('Platform Bed Frame', 'platform-bed-frame', 'Modern queen-size platform bed with upholstered headboard. Includes sturdy slat support system.', 899.99, bedroom_id, '["https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 12, true),
  ('6-Drawer Dresser', '6-drawer-dresser', 'Spacious dresser with soft-close drawers. Finished in rich walnut with antique brass handles.', 749.99, bedroom_id, '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 10, false),
  ('Nightstand Set', 'nightstand-set', 'Set of 2 matching nightstands with single drawer and open shelf. Perfect beside any bed.', 299.99, bedroom_id, '["https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 30, false),
  ('Full-Length Mirror', 'full-length-mirror', 'Standing floor mirror with adjustable tilt. Features solid wood frame in natural finish.', 349.99, bedroom_id, '["https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 22, false)
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Dining Products
  INSERT INTO products (name, slug, description, price, category_id, images, stock, featured) VALUES
  ('Extendable Dining Table', 'extendable-dining-table', 'Elegant dining table seats 6-8 people. Extends from 60" to 78" with built-in butterfly leaf.', 1499.99, dining_id, '["https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 8, true),
  ('Upholstered Dining Chairs', 'upholstered-dining-chairs', 'Set of 4 comfortable dining chairs with padded seats and backs. Durable fabric in neutral tone.', 799.99, dining_id, '["https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 16, true),
  ('Buffet Cabinet', 'buffet-cabinet', 'Stylish storage solution with glass-front upper cabinets and solid wood lower drawers.', 1099.99, dining_id, '["https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 6, false),
  ('Bar Cart', 'bar-cart', 'Mobile bar cart with gold-finished frame and mirrored shelves. Perfect for entertaining.', 329.99, dining_id, '["https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 14, false)
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Office Products
  INSERT INTO products (name, slug, description, price, category_id, images, stock, featured) VALUES
  ('Executive Desk', 'executive-desk', 'Spacious L-shaped desk with built-in drawers and cable management. Premium finish.', 1299.99, office_id, '["https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 9, true),
  ('Ergonomic Office Chair', 'ergonomic-office-chair', 'High-back mesh office chair with lumbar support, adjustable armrests, and seat height.', 549.99, office_id, '["https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 25, false),
  ('Bookshelf Unit', 'bookshelf-unit', '5-tier bookshelf with open design. Holds books, decor, and office supplies. Easy assembly.', 399.99, office_id, '["https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 20, false),
  ('Filing Cabinet', 'filing-cabinet', '3-drawer vertical filing cabinet with lock. Fits letter and legal size documents.', 279.99, office_id, '["https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200"]'::jsonb, 15, false)
  ON CONFLICT (slug) DO NOTHING;

END $$;
