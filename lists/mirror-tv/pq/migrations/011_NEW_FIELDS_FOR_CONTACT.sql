
CREATE TABLE public."Contact_relatedSeries_Serie_relatedContacts" (
    "Contact_left_id" integer NOT NULL,
    "Serie_right_id" integer NOT NULL
);

CREATE TABLE public."Contact_relatedShows_Show_hostName" (
    "Contact_left_id" integer NOT NULL,
    "Show_right_id" integer NOT NULL
);

--
-- Name: contact_relatedshows_show_hostname_contact_left_id_index; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX contact_relatedshows_show_hostname_contact_left_id_index ON public."Contact_relatedShows_Show_hostName" USING btree ("Contact_left_id");


--
-- Name: contact_relatedshows_show_hostname_show_right_id_index; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX contact_relatedshows_show_hostname_show_right_id_index ON public."Contact_relatedShows_Show_hostName" USING btree ("Show_right_id");
--
-- Name: contact_relatedseries_serie_relatedcontacts_contact_left_id_ind; Type: INDEX; Schema: public; Owner: keystone_agent
--
--
-- Name: Contact_relatedShows_Show_hostName contact_relatedshows_show_hostname_contact_left_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Contact_relatedShows_Show_hostName"
    ADD CONSTRAINT contact_relatedshows_show_hostname_contact_left_id_foreign FOREIGN KEY ("Contact_left_id") REFERENCES public."Contact"(id) ON DELETE CASCADE;


--
-- Name: Contact_relatedShows_Show_hostName contact_relatedshows_show_hostname_show_right_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Contact_relatedShows_Show_hostName"
    ADD CONSTRAINT contact_relatedshows_show_hostname_show_right_id_foreign FOREIGN KEY ("Show_right_id") REFERENCES public."Show"(id) ON DELETE CASCADE;


CREATE INDEX contact_relatedseries_serie_relatedcontacts_contact_left_id_ind ON public."Contact_relatedSeries_Serie_relatedContacts" USING btree ("Contact_left_id");

--
-- Name: Contact_relatedSeries_Serie_relatedContacts contact_relatedseries_serie_relatedcontacts_contact_left_id_for; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Contact_relatedSeries_Serie_relatedContacts"
    ADD CONSTRAINT contact_relatedseries_serie_relatedcontacts_contact_left_id_for FOREIGN KEY ("Contact_left_id") REFERENCES public."Contact"(id) ON DELETE CASCADE;


--
-- Name: Contact_relatedSeries_Serie_relatedContacts contact_relatedseries_serie_relatedcontacts_serie_right_id_fore; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Contact_relatedSeries_Serie_relatedContacts"
    ADD CONSTRAINT contact_relatedseries_serie_relatedcontacts_serie_right_id_fore FOREIGN KEY ("Serie_right_id") REFERENCES public."Serie"(id) ON DELETE CASCADE;

--
-- Name: contact_relatedseries_serie_relatedcontacts_serie_right_id_inde; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX contact_relatedseries_serie_relatedcontacts_serie_right_id_inde ON public."Contact_relatedSeries_Serie_relatedContacts" USING btree ("Serie_right_id");
--
--
-- Name: Contact_relatedSeries_Serie_relatedContacts; Type: TABLE; Schema: public; Owner: keystone_agent
--
CREATE TABLE public."Show_staffName_many" (
    "Show_left_id" integer NOT NULL,
    "Contact_right_id" integer NOT NULL
);

--
-- Name: show_staffname_many_contact_right_id_index; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX show_staffname_many_contact_right_id_index ON public."Show_staffName_many" USING btree ("Contact_right_id");


--
-- Name: show_staffname_many_show_left_id_index; Type: INDEX; Schema: public; Owner: keystone_agent
--

CREATE INDEX show_staffname_many_show_left_id_index ON public."Show_staffName_many" USING btree ("Show_left_id");

--
-- Name: Show_staffName_many show_staffname_many_contact_right_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Show_staffName_many"
    ADD CONSTRAINT show_staffname_many_contact_right_id_foreign FOREIGN KEY ("Contact_right_id") REFERENCES public."Contact"(id) ON DELETE CASCADE;


--
-- Name: Show_staffName_many show_staffname_many_show_left_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: keystone_agent
--

ALTER TABLE ONLY public."Show_staffName_many"
    ADD CONSTRAINT show_staffname_many_show_left_id_foreign FOREIGN KEY ("Show_left_id") REFERENCES public."Show"(id) ON DELETE CASCADE;

