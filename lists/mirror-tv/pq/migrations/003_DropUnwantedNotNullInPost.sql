-- drop unwanted NOT NULL for columns in public."Post"
ALTER TABLE public."Post" ALTER COLUMN subtitle DROP NOT NULL;
ALTER TABLE public."Post" ALTER COLUMN "ogDescription" DROP NOT NULL;
ALTER TABLE public."Post" ALTER COLUMN "ogTitle" DROP NOT NULL;
ALTER TABLE public."Post" ALTER COLUMN otherbyline DROP NOT NULL;
