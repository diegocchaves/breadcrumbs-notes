/*
  Warnings:

  - Changed the type of `fieldType` on the `FieldNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- 1. Create enum
CREATE TYPE "FieldType" AS ENUM (
  'Insight',
  'Encounter',
  'Mood',
  'Energy',
  'Thoughts',
  'Other'
);

-- 2. Add new column
ALTER TABLE "FieldNote" ADD COLUMN "fieldType_new" "FieldType";

-- 3. Copy data (cast string → enum)
UPDATE "FieldNote"
SET "fieldType_new" = CASE
  WHEN "fieldType" = 'Insight' THEN 'Insight'::"FieldType"
  WHEN "fieldType" = 'Encounter' THEN 'Encounter'::"FieldType"
  WHEN "fieldType" = 'Mood' THEN 'Mood'::"FieldType"
  WHEN "fieldType" = 'Energy' THEN 'Energy'::"FieldType"
  WHEN "fieldType" = 'Thoughts' THEN 'Thoughts'::"FieldType"
  ELSE 'Other'::"FieldType"
END;

-- 4. Drop old column
ALTER TABLE "FieldNote" DROP COLUMN "fieldType";

-- 5. Rename new column
ALTER TABLE "FieldNote" RENAME COLUMN "fieldType_new" TO "fieldType";

-- 6. Make it required
ALTER TABLE "FieldNote" ALTER COLUMN "fieldType" SET NOT NULL;
