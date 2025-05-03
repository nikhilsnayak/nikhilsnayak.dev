ALTER TABLE "comment" ADD COLUMN "parent_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
