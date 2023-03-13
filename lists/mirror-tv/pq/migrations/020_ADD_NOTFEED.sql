ALTER TABLE "Post" drop COLUMN "isFeed";
ALTER TABLE "Post" ADD COLUMN "notFeed" boolean;