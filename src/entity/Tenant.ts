export class Tenant {
  id?: number;
  ownerId?: number;
  pgId?: number;
  fullName: string = '';
  phone: string = '';
  tenantIdProof: string = '';
  roomNumber: string = '';
  monthlyRent: number = 0;
  moveInDate?: string;
  active: boolean = true;
  notes: string = '';
}

// FILE: src/app/entity/RentRecord.ts

export class RentRecord {
  id?: number;
  tenant?: Tenant;
  year?: number;
  month?: number;
  amountDue?: number;
  paid: boolean = false;
  paidOn?: string;
  note?: string;
}