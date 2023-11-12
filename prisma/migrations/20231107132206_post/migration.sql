-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "post" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageLink" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
