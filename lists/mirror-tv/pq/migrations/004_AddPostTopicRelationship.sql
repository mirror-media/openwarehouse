LTER TABLE "ArtShow" ADD COLUMN "state" text NOT NULL DEFAULT 'draft';                                            
ALTER TABLE "ArtShow" ADD COLUMN "publishTime" timestamp NULL;                                                     
ALTER TABLE "ArtShow" ADD COLUMN "contentHtml" text NULL;                                                          
ALTER TABLE "ArtShow" ADD COLUMN "contentApiData" text NULL;                                                       
ALTER TABLE "ArtShow" ADD COLUMN "isAdult" bool NOT NULL DEFAULT false;                                            
ALTER TABLE "ArtShow" ADD COLUMN "show" int4 NULL;                                                                 
CREATE INDEX artshow_show_index ON public."Show" USING btree (show);                                               
                                                                                                                   
--
-- Name: ArtShow_author_many; Type: TABLE; Schema: public; Owner: agent_konstantin
--
CREATE TABLE public."ArtShow_author_many" (
    "ArtShow_left_id" integer NOT NULL,
    "Contact_right_id" integer NOT NULL
);
ALTER TABLE public."ArtShow_author_many" OWNER TO agent_konstantin;
CREATE INDEX artshow_author_many_artshow_left_id_index ON public."ArtShow_author_many" USING btree ("ArtShow_left_id");
CREATE INDEX artshow_author_many_contact_right_id_index ON public."ArtShow_author_many" USING btree ("Contact_right_id");
ALTER TABLE ONLY public."ArtShow_author_many"
    ADD CONSTRAINT artshow_author_many_artshow_left_id_foreign FOREIGN KEY ("ArtShow_left_id") REFERENCES public."ArtShow"(id) ON DELETE CASCADE;
ALTER TABLE ONLY public."ArtShow_author_many"                                                                                                                     
    ADD CONSTRAINT artshow_author_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES public."Contact"(id) ON DELETE CASCADE;

-- Table: public.ArtShow_author_many                                                                               
CREATE TABLE public."Topic_post_many"                                                                              
(                                                                                                                  
    "Topic_left_id" integer NOT NULL,                                                                              
    "Post_right_id" integer NOT NULL,                                                                              
    CONSTRAINT topic_post_many_post_right_id_foreign FOREIGN KEY ("Post_right_id")                                 
        REFERENCES public."Post" (id) MATCH SIMPLE                                                                 
        ON UPDATE NO ACTION                                                                                        
        ON DELETE CASCADE,                                                                                         
    CONSTRAINT topic_post_many_topic_left_id_foreign FOREIGN KEY ("Topic_left_id")                                 
        REFERENCES public."Topic" (id) MATCH SIMPLE                                                                
        ON UPDATE NO ACTION                                                                                        
        ON DELETE CASCADE                                                                                          
)                                                                                                                  
WITH (                                                                                                             
    OIDS = FALSE                                                                                                   
)                                                                                                                  
TABLESPACE pg_default;                                                                                             
                                                                                                                   
ALTER TABLE "Contact" ADD COLUMN "bioHtml" text NULL;                                                              
ALTER TABLE "Contact" ADD COLUMN "bioApiData" text NULL;                                                           
ALTER TABLE "Serie" ADD COLUMN "introductionHtml" text NULL;                                                       
ALTER TABLE "Serie" ADD COLUMN "introductionApiData" text NULL;      

-- DROP INDEX public.topic_post_many_post_right_id_index;                                                          
CREATE INDEX topic_post_many_post_right_id_index                                                                   
    ON public."Topic_post_many" USING btree                                                                        
    ("Post_right_id" ASC NULLS LAST)                                                                               
    TABLESPACE pg_default;                                                                                         
-- Index: topic_post_many_topic_left_id_index                                                                      
-- DROP INDEX public.topic_post_many_topic_left_id_index;                                                          
CREATE INDEX topic_post_many_topic_left_id_index                                                                   
    ON public."Topic_post_many" USING btree                                                                        
    ("Topic_left_id" ASC NULLS LAST)                                                                               
    TABLESPACE pg_default; 

