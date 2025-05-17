-- CreateTable
CREATE TABLE "SlotRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "slotId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlotRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SlotRequest_userId_idx" ON "SlotRequest"("userId");

-- CreateIndex
CREATE INDEX "SlotRequest_status_idx" ON "SlotRequest"("status");

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRequest" ADD CONSTRAINT "SlotRequest_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ParkingSlot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
