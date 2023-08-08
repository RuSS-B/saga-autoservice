DROP TABLE IF EXISTS "public"."car";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS car_id_seq;

-- Table Definition
CREATE TABLE "public"."car" (
    "id" int4 NOT NULL DEFAULT nextval('car_id_seq'::regclass),
    "vin" varchar(17) NOT NULL,
    "plate_number" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."request";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS request_id_seq;

-- Table Definition
CREATE TABLE "public"."request" (
    "id" int4 NOT NULL DEFAULT nextval('request_id_seq'::regclass),
    "status_id" int4 NOT NULL,
    "car_id" int4 NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."request_status";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."request_status" (
    "id" int4 NOT NULL,
    "name" text NOT NULL,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."request" ADD FOREIGN KEY ("car_id") REFERENCES "public"."car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."request" ADD FOREIGN KEY ("status_id") REFERENCES "public"."request_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
