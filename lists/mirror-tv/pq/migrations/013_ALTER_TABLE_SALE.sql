ALTER TABLE "Sale" DROP COLUMN "state";
ALTER TABLE "Sale" DROP COLUMN "startTime";
ALTER TABLE "Sale" DROP COLUMN "endTime";
ALTER TABLE "Sale" ADD COLUMN "endTime_offset" text NULL;
ALTER TABLE "Sale" ADD COLUMN "endTime_utc" timestamp NULL;
ALTER TABLE "Sale" ADD COLUMN "startTime_offset" text NULL;
ALTER TABLE "Sale" ADD COLUMN "startTime_utc" timestamp NULL;
ALTER TABLE "Sale" ADD COLUMN "status" text NOT NULL;
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text])));