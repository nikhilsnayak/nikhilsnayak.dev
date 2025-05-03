DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'comment' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE "comment" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
    END IF;
END $$;
