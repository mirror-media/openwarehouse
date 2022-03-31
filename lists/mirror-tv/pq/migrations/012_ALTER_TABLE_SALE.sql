ALTER TABLE "Sale" ADD COLUMN "sortOrder" int4 NULL;
ALTER TABLE "Sale" ADD COLUMN "adPost" int4 NOT NULL;
ALTER TABLE "Sale" ADD COLUMN "state" text NOT NULL;
ALTER TABLE "Sale" ADD COLUMN "startTime" timestamp NULL;
ALTER TABLE "Sale" ADD COLUMN "endTime" timestamp NULL;

ALTER TABLE "Sale" DROP COLUMN "name";
ALTER TABLE "Sale" DROP COLUMN "file";
ALTER TABLE "Sale" DROP COLUMN "pdfUrl";
ALTER TABLE "Sale" ADD CONSTRAINT adPost_sortorder_unique UNIQUE ("sortOrder");
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text])));
CREATE INDEX sale_adPost_index ON "Sale" USING btree (adPost);
