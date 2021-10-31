-- public."Source" definition

CREATE TABLE "Source" (
	id serial4 NOT NULL,
	"dataSourceName" text NULL,
	url text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Source_pkey" PRIMARY KEY (id)
);
CREATE INDEX source_createdby_index ON public."Source" USING btree ("createdBy");
CREATE INDEX source_updatedby_index ON public."Source" USING btree ("updatedBy");


-- public."Source" foreign keys

ALTER TABLE public."Source" ADD CONSTRAINT source_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE public."Source" ADD CONSTRAINT source_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);

-- public."Post_dataCitation_many" definition

CREATE TABLE "Post_dataCitation_many" (
	"Post_left_id" int4 NOT NULL,
	"Source_right_id" int4 NOT NULL
);
CREATE INDEX post_datacitation_many_post_left_id_index ON public."Post_dataCitation_many" USING btree ("Post_left_id");
CREATE INDEX post_datacitation_many_source_right_id_index ON public."Post_dataCitation_many" USING btree ("Source_right_id");


-- public."Post_dataCitation_many" foreign keys

ALTER TABLE public."Post_dataCitation_many" ADD CONSTRAINT post_datacitation_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;
ALTER TABLE public."Post_dataCitation_many" ADD CONSTRAINT post_datacitation_many_source_right_id_foreign FOREIGN KEY ("Source_right_id") REFERENCES "Source"(id) ON DELETE CASCADE;