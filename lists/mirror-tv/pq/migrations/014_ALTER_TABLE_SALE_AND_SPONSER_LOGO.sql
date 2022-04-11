ALTER TABLE "Sale" ADD COLUMN "choice" int4 NOT NULL;
ALTER TABLE "Sale" ADD COLUMN "state" text NOT NULL;


ALTER TABLE "Sale" DROP COLUMN "status";
ALTER TABLE "Sale" DROP COLUMN "adPost";


ALTER TABLE "Sale" DROP COLUMN "choice";
ALTER TABLE "Sale" ADD COLUMN "adPost" int4 NOT NULL;
ALTER TABLE "Sponsor" ALTER COLUMN "logo" SET NOT NULL;

ALTER TABLE "Sale" ADD COLUMN "status" text NOT NULL;
ALTER TABLE "Sale" DROP COLUMN "state";
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text])));
CREATE INDEX sale_adPost_index ON "Sale" USING btree (adPost);

ALTER TABLE "Sale" DROP COLUMN "status";
ALTER TABLE "Sale" ADD COLUMN "state" text NOT NULL;
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text])));