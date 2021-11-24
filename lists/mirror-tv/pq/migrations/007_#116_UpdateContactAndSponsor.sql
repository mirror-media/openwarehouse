ALTER TABLE "Contact" ADD "sortOrder" int4 NULL;

ALTER TABLE "Contact" ADD CONSTRAINT contact_sortorder_unique UNIQUE ("sortOrder");

ALTER TABLE "Sponsor" ADD url text NULL;
