-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT '斤',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "origins" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "origins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quality_grades" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "quality_grades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "originId" INTEGER NOT NULL,
    "qualityId" INTEGER NOT NULL,
    "wholesalePrice" DECIMAL(10,2) NOT NULL,
    "retailPrice" DECIMAL(10,2) NOT NULL,
    "priceDate" DATE NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraper_logs" (
    "id" SERIAL NOT NULL,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "errorMsg" TEXT,

    CONSTRAINT "scraper_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "districts_name_key" ON "districts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "origins_name_key" ON "origins"("name");

-- CreateIndex
CREATE UNIQUE INDEX "quality_grades_name_key" ON "quality_grades"("name");

-- CreateIndex
CREATE INDEX "prices_productId_priceDate_idx" ON "prices"("productId", "priceDate");

-- CreateIndex
CREATE INDEX "prices_productId_districtId_priceDate_idx" ON "prices"("productId", "districtId", "priceDate");

-- CreateIndex
CREATE UNIQUE INDEX "prices_productId_districtId_originId_qualityId_priceDate_key" ON "prices"("productId", "districtId", "originId", "qualityId", "priceDate");

-- CreateIndex
CREATE INDEX "scraper_logs_runAt_idx" ON "scraper_logs"("runAt");

-- CreateIndex
CREATE INDEX "scraper_logs_status_idx" ON "scraper_logs"("status");

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_originId_fkey" FOREIGN KEY ("originId") REFERENCES "origins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_qualityId_fkey" FOREIGN KEY ("qualityId") REFERENCES "quality_grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
