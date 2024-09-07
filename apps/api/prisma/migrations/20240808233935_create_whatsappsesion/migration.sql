-- CreateTable
CREATE TABLE "session-whatsapp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "files" BYTEA NOT NULL,

    CONSTRAINT "session-whatsapp_pkey" PRIMARY KEY ("id")
);
