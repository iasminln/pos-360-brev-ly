CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploads_short_code_unique" UNIQUE("short_code")
);
