ALTER TABLE "Post" DROP CONSTRAINT "Post_style_check";
ALTER TABLE "Post" ADD CONSTRAINT "Post_style_check" CHECK (style = ANY (ARRAY['reviews'::text, 'news'::text, 'report'::text, 'memo'::text, 'dummy'::text, 'card'::text, 'qa'::text, 'project3'::text, 'embedded'::text, 'scrollablevideo'::text,'frame'::text, 'blank'::text]))

