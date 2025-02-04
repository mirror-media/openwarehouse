ALTER TABLE "Category" ADD COLUMN "style" text NOT NULL DEFAULT 'normal';
ALTER TABLE "Category" ADD CONSTRAINT "Category_style_check" CHECK ((style = ANY (ARRAY['normal'::text, 'highlight'::text])));
