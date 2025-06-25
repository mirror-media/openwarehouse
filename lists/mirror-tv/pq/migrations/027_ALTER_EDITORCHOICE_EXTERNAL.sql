ALTER TABLE "EditorChoice" ADD COLUMN "externalChoice" integer NULL;
ALTER TABLE "EditorChoice" ADD CONSTRAINT "editorchoice_externalchoice_foreign" FOREIGN KEY ("externalChoice") REFERENCES "External"(id); 
