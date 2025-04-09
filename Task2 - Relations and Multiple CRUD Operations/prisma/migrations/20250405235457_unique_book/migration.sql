/*
  Warnings:

  - A unique constraint covering the columns `[id,authorId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_id_authorId_key" ON "Book"("id", "authorId");
