-- "Feature" definition

CREATE TABLE "Feature" (
	id serial4 NOT NULL,
	"sortOrder" int4 NULL,
	"featuredPost" int4 NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	description text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Feature_pkey" PRIMARY KEY (id),
	CONSTRAINT "Feature_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text, 'invisible'::text]))),
	CONSTRAINT feature_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX feature_createdby_index ON "Feature" USING btree ("createdBy");
CREATE INDEX feature_featuredpost_index ON "Feature" USING btree ("featuredPost");
CREATE INDEX feature_updatedby_index ON "Feature" USING btree ("updatedBy");


-- "Feature" foreign keys

ALTER TABLE "Feature" ADD CONSTRAINT feature_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Feature" ADD CONSTRAINT feature_featuredpost_foreign FOREIGN KEY ("featuredPost") REFERENCES "Post"(id);
ALTER TABLE "Feature" ADD CONSTRAINT feature_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);
