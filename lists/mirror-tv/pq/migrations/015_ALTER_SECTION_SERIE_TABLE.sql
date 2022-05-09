--alter Section
ALTER TABLE "Section" ADD COLUMN "introduction"  text NULL;
ALTER TABLE "Section" ADD COLUMN "host"  int4 NULL;
ALTER TABLE "Section" ADD COLUMN "artshow"  int4 NULL;
CREATE TABLE "Section_host_many" (
	"Section_left_id" int4 NOT NULL,
	"Contact_right_id" int4 NOT NULL
);
CREATE INDEX Section_hosts_many_Contact_right_id_index ON "Section_host_many" USING btree ("Contact_right_id");
CREATE INDEX Section_hosts_many_Section_left_id_index ON "Section_host_many" USING btree ("Section_left_id");

ALTER TABLE "Section" ADD COLUMN "style"  text DEFAULT 'default';
ALTER TABLE "Section" ADD CONSTRAINT "Section_style_check" CHECK ((style = ANY (ARRAY['default'::text, 'art'::text])));

--alter  Serie
ALTER TABLE "Serie" ADD COLUMN "style"  text DEFAULT 'default';
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_style_check" CHECK ((style = ANY (ARRAY['default'::text, 'acting'::text])));

