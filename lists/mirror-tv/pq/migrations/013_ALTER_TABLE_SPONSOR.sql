ALTER TABLE "Sponsor" ADD COLUMN "state" text NOT NULL;
ALTER TABLE "Sponsor" ADD CONSTRAINT "Sponsor_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text])));
ALTER TABLE "Sponsor" ALTER COLUMN "logo" SET NOT NULL;