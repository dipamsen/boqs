-- CreateTable
CREATE TABLE "_CollectionUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollectionUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CollectionUsers_B_index" ON "_CollectionUsers"("B");

-- AddForeignKey
ALTER TABLE "_CollectionUsers" ADD CONSTRAINT "_CollectionUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionUsers" ADD CONSTRAINT "_CollectionUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
