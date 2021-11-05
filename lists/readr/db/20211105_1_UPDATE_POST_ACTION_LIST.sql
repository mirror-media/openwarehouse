-- Drop because the data structue is wrong

ALTER TABLE "Post" DROP COLUMN "actionList";

--  Add "actionList"DSefinitions

ALTER TABLE public."Post" ADD "actionList" text NULL;

ALTER TABLE public."Post" ADD "actionListApiData" text NULL;

ALTER TABLE public."Post" ADD "actionListHtml" text NULL;
