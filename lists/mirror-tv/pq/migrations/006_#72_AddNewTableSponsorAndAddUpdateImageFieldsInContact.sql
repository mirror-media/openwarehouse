-- "Contact"

-- Drop constraint before renaming coulumn image
ALTER TABLE "Contact" DROP CONSTRAINT contact_image_foreign;
ALTER TABLE "Contact" RENAME COLUMN image TO "anchorImg";

ALTER TABLE "Contact" ADD "showhostImg" int4 NULL;

-- "Contact" foreign keys

ALTER TABLE "Contact" ADD CONSTRAINT contact_showhostimg_foreign FOREIGN KEY ("showhostImg") REFERENCES "Image"(id);
ALTER TABLE "Contact" ADD CONSTRAINT contact_anchorimg_foreign FOREIGN KEY ("anchorImg") REFERENCES "Image"(id);

-- "Show"

ALTER TABLE "Show" ADD "trailerPlaylist" text NULL;

-- "Sponsor" definition

CREATE TABLE "Sponsor" (
	id serial4 NOT NULL,
	"sortOrder" int4 NULL,
	topic int4 NULL,
	logo int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Sponsor_pkey" PRIMARY KEY (id),
	CONSTRAINT sponsor_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX sponsor_createdby_index ON "Sponsor" USING btree ("createdBy");
CREATE INDEX sponsor_logo_index ON "Sponsor" USING btree (logo);
CREATE INDEX sponsor_topic_index ON "Sponsor" USING btree (topic);
CREATE INDEX sponsor_updatedby_index ON "Sponsor" USING btree ("updatedBy");

-- "Sponsor" foreign keys

ALTER TABLE "Sponsor" ADD CONSTRAINT sponsor_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Sponsor" ADD CONSTRAINT sponsor_logo_foreign FOREIGN KEY (logo) REFERENCES "Image"(id);
ALTER TABLE "Sponsor" ADD CONSTRAINT sponsor_topic_foreign FOREIGN KEY (topic) REFERENCES "Topic"(id);
ALTER TABLE "Sponsor" ADD CONSTRAINT sponsor_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);
