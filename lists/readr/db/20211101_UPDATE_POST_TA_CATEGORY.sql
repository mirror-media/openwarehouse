
BEGIN;

-- public."Post" new definition

ALTER TABLE "Post" ADD "readingTime" int4 NULL;
ALTER TABLE "Post" ADD "actionList" text NULL;
ALTER TABLE "Post" ADD citation text NULL;
ALTER TABLE "Post" ADD "citationApiData" text NULL;
ALTER TABLE "Post" ADD "citationHtml" text NULL;

-- Rename Post_tags_many to Post_tags_Tag_relatedPost

ALTER TABLE "Post_tags_many" RENAME TO "Post_tags_Tag_relatedPost";

ALTER TABLE "Post_tags_Tag_relatedPost" RENAME CONSTRAINT post_tags_many_post_left_id_foreign TO post_tags_tag_relatedpost_post_left_id_foreign;
ALTER TABLE "Post_tags_Tag_relatedPost" RENAME CONSTRAINT post_tags_many_tag_right_id_foreign TO post_tags_tag_relatedpost_tag_right_id_foreign;

DROP INDEX post_tags_many_post_left_id_index;
DROP INDEX post_tags_many_tag_right_id_index;
CREATE INDEX post_tags_tag_relatedpost_post_left_id_index ON "Post_tags_Tag_relatedPost" USING btree ("Post_left_id");
CREATE INDEX post_tags_tag_relatedpost_tag_right_id_index ON "Post_tags_Tag_relatedPost" USING btree ("Tag_right_id");


-- Rename Post_categories_many to Category_relatedPost_Post_categories

ALTER TABLE "Post_categories_many" RENAME TO "Category_relatedPost_Post_categories";

DROP INDEX post_categories_many_category_right_id_index;
DROP INDEX post_categories_many_post_left_id_index;

ALTER TABLE "Category_relatedPost_Post_categories" DROP CONSTRAINT post_categories_many_category_right_id_foreign;
ALTER TABLE "Category_relatedPost_Post_categories" DROP CONSTRAINT post_categories_many_post_left_id_foreign;

ALTER TABLE "Category_relatedPost_Post_categories" RENAME COLUMN "Post_left_id" TO "Post_right_id";
ALTER TABLE "Category_relatedPost_Post_categories" RENAME COLUMN "Category_right_id" TO "Category_left_id";

ALTER TABLE "Category_relatedPost_Post_categories"
    ADD CONSTRAINT category_relatedpost_post_categories_category_left_id_foreign FOREIGN KEY ("Category_left_id") REFERENCES "Category"(id) ON DELETE CASCADE;

ALTER TABLE "Category_relatedPost_Post_categories"
    ADD CONSTRAINT category_relatedpost_post_categories_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES "Post"(id) ON DELETE CASCADE;

CREATE INDEX category_relatedpost_post_categories_category_left_id_index ON "Category_relatedPost_Post_categories" USING btree ("Category_left_id");
CREATE INDEX category_relatedpost_post_categories_post_right_id_index ON "Category_relatedPost_Post_categories" USING btree ("Post_right_id");

COMMIT;
