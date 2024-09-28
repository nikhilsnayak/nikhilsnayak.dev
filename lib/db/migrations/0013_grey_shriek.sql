ALTER TABLE "embeddings" RENAME TO "document";--> statement-breakpoint
ALTER TABLE "document" ADD COLUMN "metadata" jsonb;