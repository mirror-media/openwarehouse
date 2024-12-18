-- "External_tags_many" definition

-- Drop table

-- DROP TABLE "External_tags_many";

CREATE TABLE "External_tags_many" (
	"External_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX external_tags_many_external_left_id_index ON "External_tags_many" USING btree ("External_left_id");
CREATE INDEX external_tags_many_tag_right_id_index ON "External_tags_many" USING btree ("Tag_right_id");


-- "external_tags_many" definition
