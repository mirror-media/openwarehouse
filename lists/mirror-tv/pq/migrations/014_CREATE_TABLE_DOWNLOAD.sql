-- "Download" definition

CREATE TABLE "Download" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	"file" jsonb NULL,
	"url" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Download_pkey" PRIMARY KEY (id)
);
CREATE INDEX download_createdby_index ON "Download" USING btree ("createdBy");
CREATE INDEX download_updatedby_index ON "Download" USING btree ("updatedBy");

-- "Download" foreign keys

ALTER TABLE "Download" ADD CONSTRAINT download_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Download" ADD CONSTRAINT download_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);

--"Post"update 
ALTER TABLE "Post" ADD COLUMN "download" int4 NULL;
CREATE TABLE "Post_download_many" (
	"Post_left_id" int4 NOT NULL,
	"Download_right_id" int4 NOT NULL
);
CREATE INDEX post_downloads_many_download_right_id_index ON "Post_download_many" USING btree ("Download_right_id");
CREATE INDEX post_downloads_many_post_left_id_index ON "Post_download_many" USING btree ("Post_left_id");
