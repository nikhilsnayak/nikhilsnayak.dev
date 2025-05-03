CREATE TABLE IF NOT EXISTS "hearts" (
	"slug" varchar(255) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"client_identifier" varchar NOT NULL,
	CONSTRAINT "hearts_slug_client_identifier_pk" PRIMARY KEY("slug","client_identifier"),
	CONSTRAINT "hearts_slug_client_identifier_unique" UNIQUE NULLS NOT DISTINCT("slug","client_identifier")
);
