-- public."Contact"

-- Drop constraint before renaming coulumn image
ALTER TABLE public."Contact" DROP CONSTRAINT contact_image_foreign;
ALTER TABLE public."Contact" RENAME COLUMN image TO "anchorImg";

ALTER TABLE public."Contact" ADD "showhostImg" int4 NULL;

-- public."Contact" foreign keys

ALTER TABLE public."Contact" ADD CONSTRAINT contact_showhostimg_foreign FOREIGN KEY ("showhostImg") REFERENCES "Image"(id);
ALTER TABLE public."Contact" ADD CONSTRAINT contact_anchorimg_foreign FOREIGN KEY ("anchorImg") REFERENCES "Image"(id);

-- public."Show"

ALTER TABLE public."Show" ADD "trailerPlaylist" text NULL;

-- public."Sponsor" definition

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
CREATE INDEX sponsor_createdby_index ON public."Sponsor" USING btree ("createdBy");
CREATE INDEX sponsor_logo_index ON public."Sponsor" USING btree (logo);
CREATE INDEX sponsor_topic_index ON public."Sponsor" USING btree (topic);
CREATE INDEX sponsor_updatedby_index ON public."Sponsor" USING btree ("updatedBy");

-- public."Sponsor" foreign keys

ALTER TABLE public."Sponsor" ADD CONSTRAINT sponsor_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE public."Sponsor" ADD CONSTRAINT sponsor_logo_foreign FOREIGN KEY (logo) REFERENCES "Image"(id);
ALTER TABLE public."Sponsor" ADD CONSTRAINT sponsor_topic_foreign FOREIGN KEY (topic) REFERENCES "Topic"(id);
ALTER TABLE public."Sponsor" ADD CONSTRAINT sponsor_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);
