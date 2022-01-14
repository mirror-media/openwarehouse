ALTER TABLE "Topic" DROP CONSTRAINT "Topic_titleStyle_check";
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_leading_check";
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_leading_check" CHECK ("leading" = ANY (ARRAY['video'::text, 'slideshow'::text, 'image'::text, 'multivideo'::text]));
ALTER TABLE "Topic" ADD COLUMN "facebook" text;
ALTER TABLE "Topic" ADD COLUMN "instagram" text;
ALTER TABLE "Topic" ADD COLUMN "line" text;
ALTER TABLE "Topic" DROP COLUMN "subtitle";
ALTER TABLE "Topic" DROP COLUMN "titleStyle";
ALTER TABLE "Topic" DROP COLUMN "type";
ALTER TABLE "Topic" DROP COLUMN "heroImageSize";
ALTER TABLE "Topic" DROP COLUMN "dfp";
ALTER TABLE "Topic" DROP COLUMN "css";
ALTER TABLE "Topic" DROP COLUMN "javascript";
ALTER TABLE "Topic" DROP COLUMN "mobileDfp";


CREATE TABLE public."Topic_slideshow_many" (
    "Topic_left_id" integer NOT NULL,
    "Post_right_id" integer NOT NULL
);

--
-- Name: topic_slideshow_many_post_right_id_index; Type: INDEX; Schema: public; Owner: keystone_agent                                                                         
--

CREATE INDEX topic_slideshow_many_post_right_id_index ON public."Topic_slideshow_many" USING btree ("Post_right_id");


--
-- Name: topic_slideshow_many_topic_left_id_index; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX topic_slideshow_many_topic_left_id_index ON public."Topic_slideshow_many" USING btree ("Topic_left_id");


--
-- Name: Topic_slideshow_many topic_slideshow_many_post_right_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent                                          
--

ALTER TABLE ONLY public."Topic_slideshow_many"
    ADD CONSTRAINT topic_slideshow_many_post_right_id_foreign FOREIGN KEY ("Post_right_id") REFERENCES public."Post"(id) ON DELETE CASCADE;


--
-- Name: Topic_slideshow_many topic_slideshow_many_topic_left_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Topic_slideshow_many"
    ADD CONSTRAINT topic_slideshow_many_topic_left_id_foreign FOREIGN KEY ("Topic_left_id") REFERENCES public."Topic"(id) ON DELETE CASCADE;

--                                                                                                                                                                 
-- Name: Topic_multivideo_many; Type: TABLE; Schema: public; Owner: keystone_agent                                                                                 
--                                                                                                                                                                 
                                                                                                                                                                   
CREATE TABLE public."Topic_multivideo_many" (                                                                                                                      
    "Topic_left_id" integer NOT NULL,                                                                                                                              
    "Video_right_id" integer NOT NULL                                                                                                                              
);                                                                                                                                                                 
                                                                                                                                                                   
--                                                                                                                                                                 
-- Name: topic_multivideo_many_topic_left_id_index; Type: INDEX; Schema: public; Owner: keystone_agent                                                             
                                                                                                                                                                   
--                                                                                                                                                                 
                                                                                                                                                                   
CREATE INDEX topic_multivideo_many_topic_left_id_index ON public."Topic_multivideo_many" USING btree ("Topic_left_id");                                            
                                                                                                                                                                   
                                                                                                                                                                   
--                                                                                                                                                                 
-- Name: topic_multivideo_many_video_right_id_index; Type: INDEX; Schema: public; Owner: keystone_agent                                                            
--                                                                                                                                                                 
                                                                                                                                                                   
CREATE INDEX topic_multivideo_many_video_right_id_index ON public."Topic_multivideo_many" USING btree ("Video_right_id");                                          
                                                                                                                                                                   
--                                                                                                                                                                 
-- Name: Topic_multivideo_many topic_multivideo_many_topic_left_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent                             
                                                                                                                                                                   
--                                                                                                                                                                 
                                                                                                                                                                   
ALTER TABLE ONLY public."Topic_multivideo_many"                                                                                                                    
    ADD CONSTRAINT topic_multivideo_many_topic_left_id_foreign FOREIGN KEY ("Topic_left_id") REFERENCES public."Topic"(id) ON DELETE CASCADE;                      
                                                                                                                                                                   
                                                                                                                                                                   
--                                                                                                                                                                 
-- Name: Topic_multivideo_many topic_multivideo_many_video_right_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent                            
--                                                                                                                                                                 
                                                                                                                                                                   
ALTER TABLE ONLY public."Topic_multivideo_many"                                                                                                                    
    ADD CONSTRAINT topic_multivideo_many_video_right_id_foreign FOREIGN KEY ("Video_right_id") REFERENCES public."Video"(id) ON DELETE CASCADE;                    
                                                                                                                                                                   
