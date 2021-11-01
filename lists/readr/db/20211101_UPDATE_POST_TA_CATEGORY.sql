-- public."Post" new definition

ALTER TABLE public."Post" ADD "readingTime" int4 NULL;
ALTER TABLE public."Post" ADD "actionList" text NULL;
ALTER TABLE public."Post" ADD citation text NULL;
ALTER TABLE public."Post" ADD "citationApiData" text NULL;
ALTER TABLE public."Post" ADD "citationHtml" text NULL;


-- public."Category_relatedPost_many" definition

CREATE TABLE "Category_relatedPost_many" (
	"Category_left_id" int4 NOT NULL,
	"Post_right_id" int4 NOT NULL
);
CREATE INDEX category_relatedpost_many_category_left_id_index ON public."Category_relatedPost_many" USING btree ("Category_left_id");
CREATE INDEX category_relatedpost_many_post_right_id_index ON public."Category_relatedPost_many" USING btree ("Post_right_id");


-- public."Category_relatedPost_many" foreign keys

ALTER TABLE public."Category_relatedPost_many" ADD CONSTRAINT category_relatedpost_many_category_left_id_foreign FOREIGN KEY ("Category_left_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE public."Category_relatedPost_many" ADD CONSTRAINT category_relatedpost_many_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- public."Tag_relatedPost_many" definition

CREATE TABLE "Tag_relatedPost_many" (
	"Tag_left_id" int4 NOT NULL,
	"Post_right_id" int4 NOT NULL
);
CREATE INDEX tag_relatedpost_many_post_right_id_index ON public."Tag_relatedPost_many" USING btree ("Post_right_id");
CREATE INDEX tag_relatedpost_many_tag_left_id_index ON public."Tag_relatedPost_many" USING btree ("Tag_left_id");


-- public."Tag_relatedPost_many" foreign keys

ALTER TABLE public."Tag_relatedPost_many" ADD CONSTRAINT tag_relatedpost_many_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES "Post"(id) ON DELETE CASCADE;
ALTER TABLE public."Tag_relatedPost_many" ADD CONSTRAINT tag_relatedpost_many_tag_left_id_foreign FOREIGN KEY ("Tag_left_id") REFERENCES "Tag"(id) ON DELETE CASCADE;
