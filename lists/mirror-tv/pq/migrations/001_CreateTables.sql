-- "User" definition

-- Drop table

-- DROP TABLE "User";

CREATE TABLE "User" (
	id serial NOT NULL,
	"name" text NOT NULL,
	email text NOT NULL,
	"password" varchar(60) NULL,
	"role" text NOT NULL,
	"isProtected" bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "User_pkey" PRIMARY KEY (id),
	CONSTRAINT user_email_unique UNIQUE (email),
	CONSTRAINT user_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT user_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX user_createdby_index ON "User" USING btree ("createdBy");
CREATE INDEX user_updatedby_index ON "User" USING btree ("updatedBy");


-- "EditLog" definition

-- Drop table

-- DROP TABLE "EditLog";

CREATE TABLE "EditLog" (
	id serial NOT NULL,
	"name" text NOT NULL,
	operation text NULL,
	"postId" text NULL,
	"changedList" text NULL,
	brief text NULL,
	"content" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "EditLog_pkey" PRIMARY KEY (id),
	CONSTRAINT editlog_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT editlog_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX editlog_createdby_index ON "EditLog" USING btree ("createdBy");
CREATE INDEX editlog_updatedby_index ON "EditLog" USING btree ("updatedBy");


-- "Partner" definition

-- Drop table

-- DROP TABLE "Partner";

CREATE TABLE "Partner" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	website text NULL,
	"isPublic" bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Partner_pkey" PRIMARY KEY (id),
	CONSTRAINT partner_slug_unique UNIQUE (slug),
	CONSTRAINT partner_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT partner_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX partner_createdby_index ON "Partner" USING btree ("createdBy");
CREATE INDEX partner_updatedby_index ON "Partner" USING btree ("updatedBy");


-- "PromotionVideo" definition

-- Drop table

-- DROP TABLE "PromotionVideo";

CREATE TABLE "PromotionVideo" (
	id serial NOT NULL,
	"name" text NOT NULL,
	"sortOrder" int4 NULL,
	"ytUrl" text NOT NULL,
	state text NOT NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "PromotionVideo_pkey" PRIMARY KEY (id),
	CONSTRAINT "PromotionVideo_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text]))),
	CONSTRAINT promotionvideo_sortorder_unique UNIQUE ("sortOrder"),
	CONSTRAINT promotionvideo_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT promotionvideo_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX promotionvideo_createdby_index ON "PromotionVideo" USING btree ("createdBy");
CREATE INDEX promotionvideo_updatedby_index ON "PromotionVideo" USING btree ("updatedBy");


-- "Sale" definition

-- Drop table

-- DROP TABLE "Sale";

CREATE TABLE "Sale" (
	id serial NOT NULL,
	"name" text NOT NULL,
	file jsonb NULL,
	"pdfUrl" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Sale_pkey" PRIMARY KEY (id),
	CONSTRAINT sale_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT sale_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX sale_createdby_index ON "Sale" USING btree ("createdBy");
CREATE INDEX sale_updatedby_index ON "Sale" USING btree ("updatedBy");


-- "Section" definition

-- Drop table

-- DROP TABLE "Section";

CREATE TABLE "Section" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Section_pkey" PRIMARY KEY (id),
	CONSTRAINT section_slug_unique UNIQUE (slug),
	CONSTRAINT section_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT section_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX section_createdby_index ON "Section" USING btree ("createdBy");
CREATE INDEX section_updatedby_index ON "Section" USING btree ("updatedBy");


-- "External" definition

-- Drop table

-- DROP TABLE "External";

CREATE TABLE "External" (
	id serial NOT NULL,
	slug text NOT NULL,
	partner int4 NULL,
	"name" text NOT NULL,
	subtitle text NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	byline text NULL,
	thumbnail text NULL,
	brief text NULL,
	"content" text NULL,
	"source" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "External_pkey" PRIMARY KEY (id),
	CONSTRAINT "External_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text, 'invisible'::text]))),
	CONSTRAINT external_slug_unique UNIQUE (slug),
	CONSTRAINT external_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id),
	CONSTRAINT external_partner_foreign FOREIGN KEY (partner) REFERENCES "Partner"(id),
	CONSTRAINT external_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id)
);
CREATE INDEX external_createdby_index ON "External" USING btree ("createdBy");
CREATE INDEX external_partner_index ON "External" USING btree (partner);
CREATE INDEX external_updatedby_index ON "External" USING btree ("updatedBy");


-- "ArtShow" definition

-- Drop table

-- DROP TABLE "ArtShow";

CREATE TABLE "ArtShow" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"heroImage" int4 NULL,
	"heroVideo" int4 NULL,
	"content" text NULL,
	author int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "ArtShow_pkey" PRIMARY KEY (id),
	CONSTRAINT artshow_slug_unique UNIQUE (slug)
);
CREATE INDEX artshow_author_index ON "ArtShow" USING btree (author);
CREATE INDEX artshow_createdby_index ON "ArtShow" USING btree ("createdBy");
CREATE INDEX artshow_heroimage_index ON "ArtShow" USING btree ("heroImage");
CREATE INDEX artshow_herovideo_index ON "ArtShow" USING btree ("heroVideo");
CREATE INDEX artshow_updatedby_index ON "ArtShow" USING btree ("updatedBy");


-- "ArtShow_series_Serie_post" definition

-- Drop table

-- DROP TABLE "ArtShow_series_Serie_post";

CREATE TABLE "ArtShow_series_Serie_post" (
	"ArtShow_left_id" int4 NOT NULL,
	"Serie_right_id" int4 NOT NULL
);
CREATE INDEX artshow_series_serie_post_artshow_left_id_index ON "ArtShow_series_Serie_post" USING btree ("ArtShow_left_id");
CREATE INDEX artshow_series_serie_post_serie_right_id_index ON "ArtShow_series_Serie_post" USING btree ("Serie_right_id");


-- "Audio" definition

-- Drop table

-- DROP TABLE "Audio";

CREATE TABLE "Audio" (
	id serial NOT NULL,
	"name" text NOT NULL,
	file jsonb NOT NULL,
	"coverPhoto" int4 NULL,
	meta text NULL,
	url text NULL,
	duration int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Audio_pkey" PRIMARY KEY (id)
);
CREATE INDEX audio_coverphoto_index ON "Audio" USING btree ("coverPhoto");
CREATE INDEX audio_createdby_index ON "Audio" USING btree ("createdBy");
CREATE INDEX audio_updatedby_index ON "Audio" USING btree ("updatedBy");


-- "Audio_tags_many" definition

-- Drop table

-- DROP TABLE "Audio_tags_many";

CREATE TABLE "Audio_tags_many" (
	"Audio_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX audio_tags_many_audio_left_id_index ON "Audio_tags_many" USING btree ("Audio_left_id");
CREATE INDEX audio_tags_many_tag_right_id_index ON "Audio_tags_many" USING btree ("Tag_right_id");


-- "Category" definition

-- Drop table

-- DROP TABLE "Category";

CREATE TABLE "Category" (
	id serial NOT NULL,
	"sortOrder" int4 NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"ogTitle" text NULL,
	"ogDescription" text NULL,
	"ogImage" int4 NULL,
	"isFeatured" bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Category_pkey" PRIMARY KEY (id),
	CONSTRAINT category_slug_unique UNIQUE (slug),
	CONSTRAINT category_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX category_createdby_index ON "Category" USING btree ("createdBy");
CREATE INDEX category_ogimage_index ON "Category" USING btree ("ogImage");
CREATE INDEX category_updatedby_index ON "Category" USING btree ("updatedBy");


-- "Contact" definition

-- Drop table

-- DROP TABLE "Contact";

CREATE TABLE "Contact" (
	id serial NOT NULL,
	slug text NULL,
	"name" text NOT NULL,
	email text NULL,
	image int4 NULL,
	homepage text NULL,
	facebook text NULL,
	twitter text NULL,
	instagram text NULL,
	bio text NULL,
	anchorperson bool NULL,
	host bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Contact_pkey" PRIMARY KEY (id),
	CONSTRAINT contact_slug_unique UNIQUE (slug)
);
CREATE INDEX contact_createdby_index ON "Contact" USING btree ("createdBy");
CREATE INDEX contact_image_index ON "Contact" USING btree (image);
CREATE INDEX contact_updatedby_index ON "Contact" USING btree ("updatedBy");


-- "EditorChoice" definition

-- Drop table

-- DROP TABLE "EditorChoice";

CREATE TABLE "EditorChoice" (
	id serial NOT NULL,
	"sortOrder" int4 NULL,
	choice int4 NULL,
	state text NOT NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "EditorChoice_pkey" PRIMARY KEY (id),
	CONSTRAINT "EditorChoice_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text, 'invisible'::text]))),
	CONSTRAINT editorchoice_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX editorchoice_choice_index ON "EditorChoice" USING btree (choice);
CREATE INDEX editorchoice_createdby_index ON "EditorChoice" USING btree ("createdBy");
CREATE INDEX editorchoice_updatedby_index ON "EditorChoice" USING btree ("updatedBy");


-- "Event" definition

-- Drop table

-- DROP TABLE "Event";

CREATE TABLE "Event" (
	id serial NOT NULL,
	"name" text NOT NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	"eventType" text NULL,
	"startTime_utc" timestamp NULL,
	"startTime_offset" text NULL,
	"endTime_utc" timestamp NULL,
	"endTime_offset" text NULL,
	video int4 NULL,
	image int4 NULL,
	"embedCode" text NULL,
	link text NULL,
	"isFeatured" bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Event_eventType_check" CHECK (("eventType" = ANY (ARRAY['embedded'::text, 'video'::text, 'image'::text, 'logo'::text, 'mod'::text]))),
	CONSTRAINT "Event_pkey" PRIMARY KEY (id),
	CONSTRAINT "Event_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'scheduled'::text, 'published'::text])))
);
CREATE INDEX event_createdby_index ON "Event" USING btree ("createdBy");
CREATE INDEX event_image_index ON "Event" USING btree (image);
CREATE INDEX event_updatedby_index ON "Event" USING btree ("updatedBy");
CREATE INDEX event_video_index ON "Event" USING btree (video);


-- "Event_categories_many" definition

-- Drop table

-- DROP TABLE "Event_categories_many";

CREATE TABLE "Event_categories_many" (
	"Event_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX event_categories_many_category_right_id_index ON "Event_categories_many" USING btree ("Category_right_id");
CREATE INDEX event_categories_many_event_left_id_index ON "Event_categories_many" USING btree ("Event_left_id");


-- "Image" definition

-- Drop table

-- DROP TABLE "Image";

CREATE TABLE "Image" (
	id serial NOT NULL,
	"name" text NOT NULL,
	file jsonb NOT NULL,
	copyright text NOT NULL,
	topic int4 NULL,
	"needWatermark" bool NULL,
	keywords text NULL,
	meta text NULL,
	"urlOriginal" text NULL,
	"urlDesktopSized" text NULL,
	"urlTabletSized" text NULL,
	"urlMobileSized" text NULL,
	"urlTinySized" text NULL,
	"imageApiData" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Image_pkey" PRIMARY KEY (id)
);
CREATE INDEX image_createdby_index ON "Image" USING btree ("createdBy");
CREATE INDEX image_topic_index ON "Image" USING btree (topic);
CREATE INDEX image_updatedby_index ON "Image" USING btree ("updatedBy");


-- "Image_tags_many" definition

-- Drop table

-- DROP TABLE "Image_tags_many";

CREATE TABLE "Image_tags_many" (
	"Image_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX image_tags_many_image_left_id_index ON "Image_tags_many" USING btree ("Image_left_id");
CREATE INDEX image_tags_many_tag_right_id_index ON "Image_tags_many" USING btree ("Tag_right_id");


-- "MmPost" definition

-- Drop table

-- DROP TABLE "MmPost";

CREATE TABLE "MmPost" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	subtitle text NOT NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	otherbyline text NOT NULL,
	"heroVideo" int4 NULL,
	"heroImage" int4 NULL,
	"heroCaption" text NOT NULL,
	"heroImageSize" text NOT NULL,
	"style" text NULL,
	brief text NULL,
	"content" text NULL,
	topics int4 NULL,
	audio int4 NULL,
	"relatedTopic" int4 NULL,
	"ogTitle" text NOT NULL,
	"ogDescription" text NOT NULL,
	"ogImage" int4 NULL,
	"adTraceCode" text NOT NULL,
	"isFeatured" bool NULL,
	"isAdult" bool NULL,
	"isAdvertised" bool NULL,
	"isAdBlocked" bool NULL,
	"lockTime_utc" timestamp NULL,
	"lockTime_offset" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "MmPost_heroImageSize_check" CHECK (("heroImageSize" = ANY (ARRAY['extend'::text, 'normal'::text, 'small'::text]))),
	CONSTRAINT "MmPost_pkey" PRIMARY KEY (id),
	CONSTRAINT "MmPost_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text, 'invisible'::text]))),
	CONSTRAINT "MmPost_style_check" CHECK ((style = ANY (ARRAY['article'::text, 'wide'::text, 'projects'::text, 'photography'::text, 'script'::text, 'campaign'::text, 'readr'::text]))),
	CONSTRAINT mmpost_slug_unique UNIQUE (slug)
);
CREATE INDEX mmpost_audio_index ON "MmPost" USING btree (audio);
CREATE INDEX mmpost_createdby_index ON "MmPost" USING btree ("createdBy");
CREATE INDEX mmpost_heroimage_index ON "MmPost" USING btree ("heroImage");
CREATE INDEX mmpost_herovideo_index ON "MmPost" USING btree ("heroVideo");
CREATE INDEX mmpost_ogimage_index ON "MmPost" USING btree ("ogImage");
CREATE INDEX mmpost_relatedtopic_index ON "MmPost" USING btree ("relatedTopic");
CREATE INDEX mmpost_topics_index ON "MmPost" USING btree (topics);
CREATE INDEX mmpost_updatedby_index ON "MmPost" USING btree ("updatedBy");


-- "MmPost_cameraOperators_many" definition

-- Drop table

-- DROP TABLE "MmPost_cameraOperators_many";

CREATE TABLE "MmPost_cameraOperators_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_cameraoperators_many_contact_right_id_index ON "MmPost_cameraOperators_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_cameraoperators_many_mmpost_left_id_index ON "MmPost_cameraOperators_many" USING btree ("MmPost_left_id");


-- "MmPost_categories_many" definition

-- Drop table

-- DROP TABLE "MmPost_categories_many";

CREATE TABLE "MmPost_categories_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_categories_many_category_right_id_index ON "MmPost_categories_many" USING btree ("Category_right_id");
CREATE INDEX mmpost_categories_many_mmpost_left_id_index ON "MmPost_categories_many" USING btree ("MmPost_left_id");


-- "MmPost_designers_many" definition

-- Drop table

-- DROP TABLE "MmPost_designers_many";

CREATE TABLE "MmPost_designers_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_designers_many_contact_right_id_index ON "MmPost_designers_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_designers_many_mmpost_left_id_index ON "MmPost_designers_many" USING btree ("MmPost_left_id");


-- "MmPost_engineers_many" definition

-- Drop table

-- DROP TABLE "MmPost_engineers_many";

CREATE TABLE "MmPost_engineers_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_engineers_many_contact_right_id_index ON "MmPost_engineers_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_engineers_many_mmpost_left_id_index ON "MmPost_engineers_many" USING btree ("MmPost_left_id");


-- "MmPost_photographers_many" definition

-- Drop table

-- DROP TABLE "MmPost_photographers_many";

CREATE TABLE "MmPost_photographers_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_photographers_many_contact_right_id_index ON "MmPost_photographers_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_photographers_many_mmpost_left_id_index ON "MmPost_photographers_many" USING btree ("MmPost_left_id");


-- "MmPost_relatedMmPosts_many" definition

-- Drop table

-- DROP TABLE "MmPost_relatedMmPosts_many";

CREATE TABLE "MmPost_relatedMmPosts_many" (
	"MmPost_left_id" int4 NOT NULL,
	"MmPost_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_relatedmmposts_many_mmpost_left_id_index ON "MmPost_relatedMmPosts_many" USING btree ("MmPost_left_id");
CREATE INDEX mmpost_relatedmmposts_many_mmpost_right_id_index ON "MmPost_relatedMmPosts_many" USING btree ("MmPost_right_id");


-- "MmPost_tags_many" definition

-- Drop table

-- DROP TABLE "MmPost_tags_many";

CREATE TABLE "MmPost_tags_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_tags_many_mmpost_left_id_index ON "MmPost_tags_many" USING btree ("MmPost_left_id");
CREATE INDEX mmpost_tags_many_tag_right_id_index ON "MmPost_tags_many" USING btree ("Tag_right_id");


-- "MmPost_vocals_many" definition

-- Drop table

-- DROP TABLE "MmPost_vocals_many";

CREATE TABLE "MmPost_vocals_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_vocals_many_contact_right_id_index ON "MmPost_vocals_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_vocals_many_mmpost_left_id_index ON "MmPost_vocals_many" USING btree ("MmPost_left_id");


-- "MmPost_writers_many" definition

-- Drop table

-- DROP TABLE "MmPost_writers_many";

CREATE TABLE "MmPost_writers_many" (
	"MmPost_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX mmpost_writers_many_contact_right_id_index ON "MmPost_writers_many" USING btree ("Contact_right_id");
CREATE INDEX mmpost_writers_many_mmpost_left_id_index ON "MmPost_writers_many" USING btree ("MmPost_left_id");


-- "Post" definition

-- Drop table

-- DROP TABLE "Post";

CREATE TABLE "Post" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	subtitle text NOT NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	otherbyline text NOT NULL,
	"heroVideo" int4 NULL,
	"heroImage" int4 NULL,
	"heroCaption" text NOT NULL,
	"heroImageSize" text NOT NULL,
	"style" text NOT NULL,
	brief text NULL,
	"content" text NULL,
	topics int4 NULL,
	audio int4 NULL,
	"relatedTopic" int4 NULL,
	"ogTitle" text NOT NULL,
	"ogDescription" text NOT NULL,
	"ogImage" int4 NULL,
	"adTraceCode" text NOT NULL,
	"isFeatured" bool NULL,
	"isAdult" bool NULL,
	"isAdvertised" bool NULL,
	"isAdBlocked" bool NULL,
	"lockTime_utc" timestamp NULL,
	"lockTime_offset" text NULL,
	"briefHtml" text NULL,
	"briefApiData" text NULL,
	"contentHtml" text NULL,
	"contentApiData" text NULL,
	"source" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Post_heroImageSize_check" CHECK (("heroImageSize" = ANY (ARRAY['extend'::text, 'normal'::text, 'small'::text]))),
	CONSTRAINT "Post_pkey" PRIMARY KEY (id),
	CONSTRAINT "Post_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text, 'archived'::text, 'invisible'::text]))),
	CONSTRAINT "Post_style_check" CHECK ((style = ANY (ARRAY['article'::text, 'videoNews'::text, 'wide'::text, 'projects'::text, 'photography'::text, 'script'::text, 'campaign'::text, 'readr'::text]))),
	CONSTRAINT post_slug_unique UNIQUE (slug)
);
CREATE INDEX post_audio_index ON "Post" USING btree (audio);
CREATE INDEX post_createdby_index ON "Post" USING btree ("createdBy");
CREATE INDEX post_heroimage_index ON "Post" USING btree ("heroImage");
CREATE INDEX post_herovideo_index ON "Post" USING btree ("heroVideo");
CREATE INDEX post_ogimage_index ON "Post" USING btree ("ogImage");
CREATE INDEX post_relatedtopic_index ON "Post" USING btree ("relatedTopic");
CREATE INDEX post_topics_index ON "Post" USING btree (topics);
CREATE INDEX post_updatedby_index ON "Post" USING btree ("updatedBy");


-- "Post_cameraOperators_many" definition

-- Drop table

-- DROP TABLE "Post_cameraOperators_many";

CREATE TABLE "Post_cameraOperators_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_cameraoperators_many_contact_right_id_index ON "Post_cameraOperators_many" USING btree ("Contact_right_id");
CREATE INDEX post_cameraoperators_many_post_left_id_index ON "Post_cameraOperators_many" USING btree ("Post_left_id");


-- "Post_categories_many" definition

-- Drop table

-- DROP TABLE "Post_categories_many";

CREATE TABLE "Post_categories_many" (
	"Post_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX post_categories_many_category_right_id_index ON "Post_categories_many" USING btree ("Category_right_id");
CREATE INDEX post_categories_many_post_left_id_index ON "Post_categories_many" USING btree ("Post_left_id");


-- "Post_designers_many" definition

-- Drop table

-- DROP TABLE "Post_designers_many";

CREATE TABLE "Post_designers_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_designers_many_contact_right_id_index ON "Post_designers_many" USING btree ("Contact_right_id");
CREATE INDEX post_designers_many_post_left_id_index ON "Post_designers_many" USING btree ("Post_left_id");


-- "Post_engineers_many" definition

-- Drop table

-- DROP TABLE "Post_engineers_many";

CREATE TABLE "Post_engineers_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_engineers_many_contact_right_id_index ON "Post_engineers_many" USING btree ("Contact_right_id");
CREATE INDEX post_engineers_many_post_left_id_index ON "Post_engineers_many" USING btree ("Post_left_id");


-- "Post_photographers_many" definition

-- Drop table

-- DROP TABLE "Post_photographers_many";

CREATE TABLE "Post_photographers_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_photographers_many_contact_right_id_index ON "Post_photographers_many" USING btree ("Contact_right_id");
CREATE INDEX post_photographers_many_post_left_id_index ON "Post_photographers_many" USING btree ("Post_left_id");


-- "Post_relatedPosts_many" definition

-- Drop table

-- DROP TABLE "Post_relatedPosts_many";

CREATE TABLE "Post_relatedPosts_many" (
	"Post_left_id" int4 NOT NULL,
	"Post_right_id" int4 NOT NULL
);
CREATE INDEX post_relatedposts_many_post_left_id_index ON "Post_relatedPosts_many" USING btree ("Post_left_id");
CREATE INDEX post_relatedposts_many_post_right_id_index ON "Post_relatedPosts_many" USING btree ("Post_right_id");


-- "Post_tags_many" definition

-- Drop table

-- DROP TABLE "Post_tags_many";

CREATE TABLE "Post_tags_many" (
	"Post_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX post_tags_many_post_left_id_index ON "Post_tags_many" USING btree ("Post_left_id");
CREATE INDEX post_tags_many_tag_right_id_index ON "Post_tags_many" USING btree ("Tag_right_id");


-- "Post_vocals_many" definition

-- Drop table

-- DROP TABLE "Post_vocals_many";

CREATE TABLE "Post_vocals_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_vocals_many_contact_right_id_index ON "Post_vocals_many" USING btree ("Contact_right_id");
CREATE INDEX post_vocals_many_post_left_id_index ON "Post_vocals_many" USING btree ("Post_left_id");


-- "Post_writers_many" definition

-- Drop table

-- DROP TABLE "Post_writers_many";

CREATE TABLE "Post_writers_many" (
	"Post_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX post_writers_many_contact_right_id_index ON "Post_writers_many" USING btree ("Contact_right_id");
CREATE INDEX post_writers_many_post_left_id_index ON "Post_writers_many" USING btree ("Post_left_id");


-- "Schedule" definition

-- Drop table

-- DROP TABLE "Schedule";

CREATE TABLE "Schedule" (
	id serial NOT NULL,
	"name" text NOT NULL,
	monday bool NOT NULL,
	tuesday bool NOT NULL,
	wednesday bool NOT NULL,
	thursday bool NOT NULL,
	friday bool NOT NULL,
	saturday bool NOT NULL,
	sunday bool NOT NULL,
	"hour" text NOT NULL,
	"minute" text NOT NULL,
	"parentalGuidelines" text NOT NULL,
	replay bool NULL,
	"showUrl" int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Schedule_pkey" PRIMARY KEY (id)
);
CREATE INDEX schedule_createdby_index ON "Schedule" USING btree ("createdBy");
CREATE INDEX schedule_showurl_index ON "Schedule" USING btree ("showUrl");
CREATE INDEX schedule_updatedby_index ON "Schedule" USING btree ("updatedBy");


-- "Section_series_Serie_section" definition

-- Drop table

-- DROP TABLE "Section_series_Serie_section";

CREATE TABLE "Section_series_Serie_section" (
	"Section_left_id" int4 NOT NULL,
	"Serie_right_id" int4 NOT NULL
);
CREATE INDEX section_series_serie_section_section_left_id_index ON "Section_series_Serie_section" USING btree ("Section_left_id");
CREATE INDEX section_series_serie_section_serie_right_id_index ON "Section_series_Serie_section" USING btree ("Serie_right_id");


-- "Section_show_Show_sections" definition

-- Drop table

-- DROP TABLE "Section_show_Show_sections";

CREATE TABLE "Section_show_Show_sections" (
	"Section_left_id" int4 NOT NULL,
	"Show_right_id" int4 NOT NULL
);
CREATE INDEX section_show_show_sections_section_left_id_index ON "Section_show_Show_sections" USING btree ("Section_left_id");
CREATE INDEX section_show_show_sections_show_right_id_index ON "Section_show_Show_sections" USING btree ("Show_right_id");


-- "Serie" definition

-- Drop table

-- DROP TABLE "Serie";

CREATE TABLE "Serie" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"heroImage" int4 NULL,
	introduction text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Serie_pkey" PRIMARY KEY (id),
	CONSTRAINT serie_slug_unique UNIQUE (slug)
);
CREATE INDEX serie_createdby_index ON "Serie" USING btree ("createdBy");
CREATE INDEX serie_heroimage_index ON "Serie" USING btree ("heroImage");
CREATE INDEX serie_updatedby_index ON "Serie" USING btree ("updatedBy");


-- "Show" definition

-- Drop table

-- DROP TABLE "Show";

CREATE TABLE "Show" (
	id serial NOT NULL,
	slug text NOT NULL,
	"name" text NOT NULL,
	"isArtShow" bool NULL,
	"bannerImg" int4 NULL,
	picture int4 NULL,
	"sortOrder" int4 NULL,
	introduction text NULL,
	"facebookUrl" text NULL,
	"playList01" text NULL,
	"playList02" text NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Show_pkey" PRIMARY KEY (id),
	CONSTRAINT show_slug_unique UNIQUE (slug),
	CONSTRAINT show_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX show_bannerimg_index ON "Show" USING btree ("bannerImg");
CREATE INDEX show_createdby_index ON "Show" USING btree ("createdBy");
CREATE INDEX show_picture_index ON "Show" USING btree (picture);
CREATE INDEX show_updatedby_index ON "Show" USING btree ("updatedBy");


-- "Show_hostName_many" definition

-- Drop table

-- DROP TABLE "Show_hostName_many";

CREATE TABLE "Show_hostName_many" (
	"Show_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX show_hostname_many_contact_right_id_index ON "Show_hostName_many" USING btree ("Contact_right_id");
CREATE INDEX show_hostname_many_show_left_id_index ON "Show_hostName_many" USING btree ("Show_left_id");


-- "Tag" definition

-- Drop table

-- DROP TABLE "Tag";

CREATE TABLE "Tag" (
	id serial NOT NULL,
	slug text NULL,
	"name" text NOT NULL,
	"ogTitle" text NULL,
	"ogDescription" text NULL,
	"ogImage" int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Tag_pkey" PRIMARY KEY (id),
	CONSTRAINT tag_name_unique UNIQUE (name),
	CONSTRAINT tag_slug_unique UNIQUE (slug)
);
CREATE INDEX tag_createdby_index ON "Tag" USING btree ("createdBy");
CREATE INDEX tag_ogimage_index ON "Tag" USING btree ("ogImage");
CREATE INDEX tag_updatedby_index ON "Tag" USING btree ("updatedBy");


-- "Topic" definition

-- Drop table

-- DROP TABLE "Topic";

CREATE TABLE "Topic" (
	id serial NOT NULL,
	slug text NULL,
	"sortOrder" int4 NULL,
	"name" text NOT NULL,
	subtitle text NULL,
	state text NOT NULL,
	brief text NULL,
	"leading" text NULL,
	"heroVideo" int4 NULL,
	"heroImage" int4 NULL,
	"heroImageSize" text NULL,
	"ogTitle" text NULL,
	"ogDescription" text NULL,
	"ogImage" int4 NULL,
	"titleStyle" text NOT NULL,
	"type" text NOT NULL,
	"source" text NULL,
	"sortDir" text NULL,
	css text NULL,
	javascript text NULL,
	dfp text NULL,
	"mobileDfp" text NULL,
	"isFeatured" bool NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Topic_heroImageSize_check" CHECK (("heroImageSize" = ANY (ARRAY['extend'::text, 'normal'::text, 'small'::text]))),
	CONSTRAINT "Topic_leading_check" CHECK (("leading" = ANY (ARRAY['video'::text, 'slideshow'::text, 'image'::text]))),
	CONSTRAINT "Topic_pkey" PRIMARY KEY (id),
	CONSTRAINT "Topic_sortDir_check" CHECK (("sortDir" = ANY (ARRAY['asc'::text, 'desc'::text]))),
	CONSTRAINT "Topic_source_check" CHECK ((source = ANY (ARRAY['posts'::text, 'activities'::text]))),
	CONSTRAINT "Topic_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text]))),
	CONSTRAINT "Topic_titleStyle_check" CHECK (("titleStyle" = ANY (ARRAY['feature'::text, 'wide'::text]))),
	CONSTRAINT topic_slug_unique UNIQUE (slug),
	CONSTRAINT topic_sortorder_unique UNIQUE ("sortOrder")
);
CREATE INDEX topic_createdby_index ON "Topic" USING btree ("createdBy");
CREATE INDEX topic_heroimage_index ON "Topic" USING btree ("heroImage");
CREATE INDEX topic_herovideo_index ON "Topic" USING btree ("heroVideo");
CREATE INDEX topic_ogimage_index ON "Topic" USING btree ("ogImage");
CREATE INDEX topic_updatedby_index ON "Topic" USING btree ("updatedBy");


-- "Topic_categories_many" definition

-- Drop table

-- DROP TABLE "Topic_categories_many";

CREATE TABLE "Topic_categories_many" (
	"Topic_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX topic_categories_many_category_right_id_index ON "Topic_categories_many" USING btree ("Category_right_id");
CREATE INDEX topic_categories_many_topic_left_id_index ON "Topic_categories_many" USING btree ("Topic_left_id");


-- "Topic_tags_many" definition

-- Drop table

-- DROP TABLE "Topic_tags_many";

CREATE TABLE "Topic_tags_many" (
	"Topic_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX topic_tags_many_tag_right_id_index ON "Topic_tags_many" USING btree ("Tag_right_id");
CREATE INDEX topic_tags_many_topic_left_id_index ON "Topic_tags_many" USING btree ("Topic_left_id");


-- "Video" definition

-- Drop table

-- DROP TABLE "Video";

CREATE TABLE "Video" (
	id serial NOT NULL,
	"name" text NOT NULL,
	"youtubeUrl" text NULL,
	file jsonb NULL,
	"coverPhoto" int4 NULL,
	description text NULL,
	state text NOT NULL,
	"publishTime_utc" timestamp NULL,
	"publishTime_offset" text NULL,
	"isFeed" bool NOT NULL,
	thumbnail text NULL,
	meta text NULL,
	url text NULL,
	duration int4 NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "Video_pkey" PRIMARY KEY (id),
	CONSTRAINT "Video_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text])))
);
CREATE INDEX video_coverphoto_index ON "Video" USING btree ("coverPhoto");
CREATE INDEX video_createdby_index ON "Video" USING btree ("createdBy");
CREATE INDEX video_updatedby_index ON "Video" USING btree ("updatedBy");


-- "VideoEditorChoice" definition

-- Drop table

-- DROP TABLE "VideoEditorChoice";

CREATE TABLE "VideoEditorChoice" (
	id serial NOT NULL,
	"order" numeric(18, 4) NULL,
	"videoEditor" int4 NULL,
	state text NOT NULL,
	"updatedAt_utc" timestamp NULL,
	"updatedAt_offset" text NULL,
	"createdAt_utc" timestamp NULL,
	"createdAt_offset" text NULL,
	"updatedBy" int4 NULL,
	"createdBy" int4 NULL,
	CONSTRAINT "VideoEditorChoice_pkey" PRIMARY KEY (id),
	CONSTRAINT "VideoEditorChoice_state_check" CHECK ((state = ANY (ARRAY['draft'::text, 'published'::text, 'scheduled'::text])))
);
CREATE INDEX videoeditorchoice_createdby_index ON "VideoEditorChoice" USING btree ("createdBy");
CREATE INDEX videoeditorchoice_updatedby_index ON "VideoEditorChoice" USING btree ("updatedBy");
CREATE INDEX videoeditorchoice_videoeditor_index ON "VideoEditorChoice" USING btree ("videoEditor");


-- "Video_categories_many" definition

-- Drop table

-- DROP TABLE "Video_categories_many";

CREATE TABLE "Video_categories_many" (
	"Video_left_id" int4 NOT NULL,
	"Category_right_id" int4 NOT NULL
);
CREATE INDEX video_categories_many_category_right_id_index ON "Video_categories_many" USING btree ("Category_right_id");
CREATE INDEX video_categories_many_video_left_id_index ON "Video_categories_many" USING btree ("Video_left_id");


-- "Video_relatedPosts_many" definition

-- Drop table

-- DROP TABLE "Video_relatedPosts_many";

CREATE TABLE "Video_relatedPosts_many" (
	"Video_left_id" int4 NOT NULL,
	"Post_right_id" int4 NOT NULL
);
CREATE INDEX video_relatedposts_many_post_right_id_index ON "Video_relatedPosts_many" USING btree ("Post_right_id");
CREATE INDEX video_relatedposts_many_video_left_id_index ON "Video_relatedPosts_many" USING btree ("Video_left_id");


-- "Video_tags_many" definition

-- Drop table

-- DROP TABLE "Video_tags_many";

CREATE TABLE "Video_tags_many" (
	"Video_left_id" int4 NOT NULL,
	"Tag_right_id" int4 NOT NULL
);
CREATE INDEX video_tags_many_tag_right_id_index ON "Video_tags_many" USING btree ("Tag_right_id");
CREATE INDEX video_tags_many_video_left_id_index ON "Video_tags_many" USING btree ("Video_left_id");


-- "ArtShow" foreign keys

ALTER TABLE "ArtShow" ADD CONSTRAINT artshow_author_foreign FOREIGN KEY (author) REFERENCES "Contact"(id);
ALTER TABLE "ArtShow" ADD CONSTRAINT artshow_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "ArtShow" ADD CONSTRAINT artshow_heroimage_foreign FOREIGN KEY ("heroImage") REFERENCES "Image"(id);
ALTER TABLE "ArtShow" ADD CONSTRAINT artshow_herovideo_foreign FOREIGN KEY ("heroVideo") REFERENCES "Video"(id);
ALTER TABLE "ArtShow" ADD CONSTRAINT artshow_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "ArtShow_series_Serie_post" foreign keys

ALTER TABLE "ArtShow_series_Serie_post" ADD CONSTRAINT artshow_series_serie_post_artshow_left_id_foreign FOREIGN KEY ("ArtShow_left_id") REFERENCES "ArtShow"(id) ON DELETE CASCADE;
ALTER TABLE "ArtShow_series_Serie_post" ADD CONSTRAINT artshow_series_serie_post_serie_right_id_foreign FOREIGN KEY ("Serie_right_id") REFERENCES "Serie"(id) ON DELETE CASCADE;


-- "Audio" foreign keys

ALTER TABLE "Audio" ADD CONSTRAINT audio_coverphoto_foreign FOREIGN KEY ("coverPhoto") REFERENCES "Image"(id);
ALTER TABLE "Audio" ADD CONSTRAINT audio_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Audio" ADD CONSTRAINT audio_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Audio_tags_many" foreign keys

ALTER TABLE "Audio_tags_many" ADD CONSTRAINT audio_tags_many_audio_left_id_foreign FOREIGN KEY ("Audio_left_id") REFERENCES "Audio"(id) ON DELETE CASCADE;
ALTER TABLE "Audio_tags_many" ADD CONSTRAINT audio_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;


-- "Category" foreign keys

ALTER TABLE "Category" ADD CONSTRAINT category_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Category" ADD CONSTRAINT category_ogimage_foreign FOREIGN KEY ("ogImage") REFERENCES "Image"(id);
ALTER TABLE "Category" ADD CONSTRAINT category_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Contact" foreign keys

ALTER TABLE "Contact" ADD CONSTRAINT contact_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Contact" ADD CONSTRAINT contact_image_foreign FOREIGN KEY (image) REFERENCES "Image"(id);
ALTER TABLE "Contact" ADD CONSTRAINT contact_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "EditorChoice" foreign keys

ALTER TABLE "EditorChoice" ADD CONSTRAINT editorchoice_choice_foreign FOREIGN KEY (choice) REFERENCES "Post"(id);
ALTER TABLE "EditorChoice" ADD CONSTRAINT editorchoice_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "EditorChoice" ADD CONSTRAINT editorchoice_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Event" foreign keys

ALTER TABLE "Event" ADD CONSTRAINT event_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Event" ADD CONSTRAINT event_image_foreign FOREIGN KEY (image) REFERENCES "Image"(id);
ALTER TABLE "Event" ADD CONSTRAINT event_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);
ALTER TABLE "Event" ADD CONSTRAINT event_video_foreign FOREIGN KEY (video) REFERENCES "Video"(id);


-- "Event_categories_many" foreign keys

ALTER TABLE "Event_categories_many" ADD CONSTRAINT event_categories_many_category_right_id_foreign FOREIGN KEY ("Category_right_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE "Event_categories_many" ADD CONSTRAINT event_categories_many_event_left_id_foreign FOREIGN KEY ("Event_left_id") REFERENCES "Event"(id) ON DELETE CASCADE;


-- "Image" foreign keys

ALTER TABLE "Image" ADD CONSTRAINT image_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Image" ADD CONSTRAINT image_topic_foreign FOREIGN KEY (topic) REFERENCES "Topic"(id);
ALTER TABLE "Image" ADD CONSTRAINT image_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Image_tags_many" foreign keys

ALTER TABLE "Image_tags_many" ADD CONSTRAINT image_tags_many_image_left_id_foreign FOREIGN KEY ("Image_left_id") REFERENCES "Image"(id) ON DELETE CASCADE;
ALTER TABLE "Image_tags_many" ADD CONSTRAINT image_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;


-- "MmPost" foreign keys

ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_audio_foreign FOREIGN KEY (audio) REFERENCES "Audio"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_heroimage_foreign FOREIGN KEY ("heroImage") REFERENCES "Image"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_herovideo_foreign FOREIGN KEY ("heroVideo") REFERENCES "Video"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_ogimage_foreign FOREIGN KEY ("ogImage") REFERENCES "Image"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_relatedtopic_foreign FOREIGN KEY ("relatedTopic") REFERENCES "Topic"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_topics_foreign FOREIGN KEY (topics) REFERENCES "Topic"(id);
ALTER TABLE "MmPost" ADD CONSTRAINT mmpost_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "MmPost_cameraOperators_many" foreign keys

ALTER TABLE "MmPost_cameraOperators_many" ADD CONSTRAINT mmpost_cameraoperators_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_cameraOperators_many" ADD CONSTRAINT mmpost_cameraoperators_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_categories_many" foreign keys

ALTER TABLE "MmPost_categories_many" ADD CONSTRAINT mmpost_categories_many_category_right_id_foreign FOREIGN KEY ("Category_right_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_categories_many" ADD CONSTRAINT mmpost_categories_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_designers_many" foreign keys

ALTER TABLE "MmPost_designers_many" ADD CONSTRAINT mmpost_designers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_designers_many" ADD CONSTRAINT mmpost_designers_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_engineers_many" foreign keys

ALTER TABLE "MmPost_engineers_many" ADD CONSTRAINT mmpost_engineers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_engineers_many" ADD CONSTRAINT mmpost_engineers_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_photographers_many" foreign keys

ALTER TABLE "MmPost_photographers_many" ADD CONSTRAINT mmpost_photographers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_photographers_many" ADD CONSTRAINT mmpost_photographers_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_relatedMmPosts_many" foreign keys

ALTER TABLE "MmPost_relatedMmPosts_many" ADD CONSTRAINT mmpost_relatedmmposts_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_relatedMmPosts_many" ADD CONSTRAINT mmpost_relatedmmposts_many_mmpost_right_id_foreign FOREIGN KEY ("MmPost_right_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_tags_many" foreign keys

ALTER TABLE "MmPost_tags_many" ADD CONSTRAINT mmpost_tags_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_tags_many" ADD CONSTRAINT mmpost_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;


-- "MmPost_vocals_many" foreign keys

ALTER TABLE "MmPost_vocals_many" ADD CONSTRAINT mmpost_vocals_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_vocals_many" ADD CONSTRAINT mmpost_vocals_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "MmPost_writers_many" foreign keys

ALTER TABLE "MmPost_writers_many" ADD CONSTRAINT mmpost_writers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "MmPost_writers_many" ADD CONSTRAINT mmpost_writers_many_mmpost_left_id_foreign FOREIGN KEY ("MmPost_left_id") REFERENCES "MmPost"(id) ON DELETE CASCADE;


-- "Post" foreign keys

ALTER TABLE "Post" ADD CONSTRAINT post_audio_foreign FOREIGN KEY (audio) REFERENCES "Audio"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_heroimage_foreign FOREIGN KEY ("heroImage") REFERENCES "Image"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_herovideo_foreign FOREIGN KEY ("heroVideo") REFERENCES "Video"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_ogimage_foreign FOREIGN KEY ("ogImage") REFERENCES "Image"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_relatedtopic_foreign FOREIGN KEY ("relatedTopic") REFERENCES "Topic"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_topics_foreign FOREIGN KEY (topics) REFERENCES "Topic"(id);
ALTER TABLE "Post" ADD CONSTRAINT post_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Post_cameraOperators_many" foreign keys

ALTER TABLE "Post_cameraOperators_many" ADD CONSTRAINT post_cameraoperators_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_cameraOperators_many" ADD CONSTRAINT post_cameraoperators_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_categories_many" foreign keys

ALTER TABLE "Post_categories_many" ADD CONSTRAINT post_categories_many_category_right_id_foreign FOREIGN KEY ("Category_right_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE "Post_categories_many" ADD CONSTRAINT post_categories_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_designers_many" foreign keys

ALTER TABLE "Post_designers_many" ADD CONSTRAINT post_designers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_designers_many" ADD CONSTRAINT post_designers_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_engineers_many" foreign keys

ALTER TABLE "Post_engineers_many" ADD CONSTRAINT post_engineers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_engineers_many" ADD CONSTRAINT post_engineers_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_photographers_many" foreign keys

ALTER TABLE "Post_photographers_many" ADD CONSTRAINT post_photographers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_photographers_many" ADD CONSTRAINT post_photographers_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_relatedPosts_many" foreign keys

ALTER TABLE "Post_relatedPosts_many" ADD CONSTRAINT post_relatedposts_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;
ALTER TABLE "Post_relatedPosts_many" ADD CONSTRAINT post_relatedposts_many_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_tags_many" foreign keys

ALTER TABLE "Post_tags_many" ADD CONSTRAINT post_tags_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;
ALTER TABLE "Post_tags_many" ADD CONSTRAINT post_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;


-- "Post_vocals_many" foreign keys

ALTER TABLE "Post_vocals_many" ADD CONSTRAINT post_vocals_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_vocals_many" ADD CONSTRAINT post_vocals_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Post_writers_many" foreign keys

ALTER TABLE "Post_writers_many" ADD CONSTRAINT post_writers_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Post_writers_many" ADD CONSTRAINT post_writers_many_post_left_id_foreign FOREIGN KEY ("Post_left_id") REFERENCES "Post"(id) ON DELETE CASCADE;


-- "Schedule" foreign keys

ALTER TABLE "Schedule" ADD CONSTRAINT schedule_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_showurl_foreign FOREIGN KEY ("showUrl") REFERENCES "Show"(id);
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Section_series_Serie_section" foreign keys

ALTER TABLE "Section_series_Serie_section" ADD CONSTRAINT section_series_serie_section_section_left_id_foreign FOREIGN KEY ("Section_left_id") REFERENCES "Section"(id) ON DELETE CASCADE;
ALTER TABLE "Section_series_Serie_section" ADD CONSTRAINT section_series_serie_section_serie_right_id_foreign FOREIGN KEY ("Serie_right_id") REFERENCES "Serie"(id) ON DELETE CASCADE;


-- "Section_show_Show_sections" foreign keys

ALTER TABLE "Section_show_Show_sections" ADD CONSTRAINT section_show_show_sections_section_left_id_foreign FOREIGN KEY ("Section_left_id") REFERENCES "Section"(id) ON DELETE CASCADE;
ALTER TABLE "Section_show_Show_sections" ADD CONSTRAINT section_show_show_sections_show_right_id_foreign FOREIGN KEY ("Show_right_id") REFERENCES "Show"(id) ON DELETE CASCADE;


-- "Serie" foreign keys

ALTER TABLE "Serie" ADD CONSTRAINT serie_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Serie" ADD CONSTRAINT serie_heroimage_foreign FOREIGN KEY ("heroImage") REFERENCES "Image"(id);
ALTER TABLE "Serie" ADD CONSTRAINT serie_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Show" foreign keys

ALTER TABLE "Show" ADD CONSTRAINT show_bannerimg_foreign FOREIGN KEY ("bannerImg") REFERENCES "Image"(id);
ALTER TABLE "Show" ADD CONSTRAINT show_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Show" ADD CONSTRAINT show_picture_foreign FOREIGN KEY (picture) REFERENCES "Image"(id);
ALTER TABLE "Show" ADD CONSTRAINT show_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Show_hostName_many" foreign keys

ALTER TABLE "Show_hostName_many" ADD CONSTRAINT show_hostname_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES "Contact"(id) ON DELETE CASCADE;
ALTER TABLE "Show_hostName_many" ADD CONSTRAINT show_hostname_many_show_left_id_foreign FOREIGN KEY ("Show_left_id") REFERENCES "Show"(id) ON DELETE CASCADE;


-- "Tag" foreign keys

ALTER TABLE "Tag" ADD CONSTRAINT tag_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Tag" ADD CONSTRAINT tag_ogimage_foreign FOREIGN KEY ("ogImage") REFERENCES "Image"(id);
ALTER TABLE "Tag" ADD CONSTRAINT tag_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Topic" foreign keys

ALTER TABLE "Topic" ADD CONSTRAINT topic_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Topic" ADD CONSTRAINT topic_heroimage_foreign FOREIGN KEY ("heroImage") REFERENCES "Image"(id);
ALTER TABLE "Topic" ADD CONSTRAINT topic_herovideo_foreign FOREIGN KEY ("heroVideo") REFERENCES "Video"(id);
ALTER TABLE "Topic" ADD CONSTRAINT topic_ogimage_foreign FOREIGN KEY ("ogImage") REFERENCES "Image"(id);
ALTER TABLE "Topic" ADD CONSTRAINT topic_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "Topic_categories_many" foreign keys

ALTER TABLE "Topic_categories_many" ADD CONSTRAINT topic_categories_many_category_right_id_foreign FOREIGN KEY ("Category_right_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE "Topic_categories_many" ADD CONSTRAINT topic_categories_many_topic_left_id_foreign FOREIGN KEY ("Topic_left_id") REFERENCES "Topic"(id) ON DELETE CASCADE;


-- "Topic_tags_many" foreign keys

ALTER TABLE "Topic_tags_many" ADD CONSTRAINT topic_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;
ALTER TABLE "Topic_tags_many" ADD CONSTRAINT topic_tags_many_topic_left_id_foreign FOREIGN KEY ("Topic_left_id") REFERENCES "Topic"(id) ON DELETE CASCADE;


-- "Video" foreign keys

ALTER TABLE "Video" ADD CONSTRAINT video_coverphoto_foreign FOREIGN KEY ("coverPhoto") REFERENCES "Image"(id);
ALTER TABLE "Video" ADD CONSTRAINT video_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "Video" ADD CONSTRAINT video_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);


-- "VideoEditorChoice" foreign keys

ALTER TABLE "VideoEditorChoice" ADD CONSTRAINT videoeditorchoice_createdby_foreign FOREIGN KEY ("createdBy") REFERENCES "User"(id);
ALTER TABLE "VideoEditorChoice" ADD CONSTRAINT videoeditorchoice_updatedby_foreign FOREIGN KEY ("updatedBy") REFERENCES "User"(id);
ALTER TABLE "VideoEditorChoice" ADD CONSTRAINT videoeditorchoice_videoeditor_foreign FOREIGN KEY ("videoEditor") REFERENCES "Post"(id);


-- "Video_categories_many" foreign keys

ALTER TABLE "Video_categories_many" ADD CONSTRAINT video_categories_many_category_right_id_foreign FOREIGN KEY ("Category_right_id") REFERENCES "Category"(id) ON DELETE CASCADE;
ALTER TABLE "Video_categories_many" ADD CONSTRAINT video_categories_many_video_left_id_foreign FOREIGN KEY ("Video_left_id") REFERENCES "Video"(id) ON DELETE CASCADE;


-- "Video_relatedPosts_many" foreign keys

ALTER TABLE "Video_relatedPosts_many" ADD CONSTRAINT video_relatedposts_many_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES "Post"(id) ON DELETE CASCADE;
ALTER TABLE "Video_relatedPosts_many" ADD CONSTRAINT video_relatedposts_many_video_left_id_foreign FOREIGN KEY ("Video_left_id") REFERENCES "Video"(id) ON DELETE CASCADE;


-- "Video_tags_many" foreign keys

ALTER TABLE "Video_tags_many" ADD CONSTRAINT video_tags_many_tag_right_id_foreign FOREIGN KEY ("Tag_right_id") REFERENCES "Tag"(id) ON DELETE CASCADE;
ALTER TABLE "Video_tags_many" ADD CONSTRAINT video_tags_many_video_left_id_foreign FOREIGN KEY ("Video_left_id") REFERENCES "Video"(id) ON DELETE CASCADE;
