
-- "External_categories_many" definition

-- Drop table

-- DROP TABLE "External_categories_many";

CREATE TABLE "External_categories_many" (
	"External_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX external_categories_many_category_right_id_index ON "External_categories_many" USING btree ("Category_right_id");
CREATE INDEX external_categories_many_external_left_id_index ON "External_categories_many" USING btree ("External_left_id");


