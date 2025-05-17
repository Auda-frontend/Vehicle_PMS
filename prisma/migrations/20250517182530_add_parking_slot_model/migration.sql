-- CreateTable
CREATE TABLE "ParkingSlot" (
    "id" TEXT NOT NULL,
    "slotNumber" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSlot_slotNumber_key" ON "ParkingSlot"("slotNumber");

-- CreateIndex
CREATE INDEX "ParkingSlot_slotNumber_idx" ON "ParkingSlot"("slotNumber");

-- CreateIndex
CREATE INDEX "ParkingSlot_status_idx" ON "ParkingSlot"("status");
