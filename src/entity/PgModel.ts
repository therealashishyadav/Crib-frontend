// src/app/entity/pg.model.ts

// ── Sharing Option Model ───────────────────────────────────────────────────
export class SharingOptionModel {
  constructor(
    public sharingType: string = 'ONE_SHARING',
    public pricePerMonth: number = 0,
    public totalBeds: number = 1,
    public amenities: string[] = []
  ) {}
}

// ── Main PG Entity Model ───────────────────────────────────────────────────
export class PgModel {
  constructor(
    public pgName: string = '',
    public fullAddress: string = '',
    public city: string = '',
    public locality: string = '',
    public pinCode: string = '',
    public googleMapLink: string = '',
    public nearbyLandmarks: string = '',
    public coverImageUrl: string = '',
    public galleryImages: string[] = [],
    public virtualTourLink: string = '',
    public videoLink: string = '',
    public occupancyType: string = '',
    public roomSizeSqFt: number = 0,
    public furnished: boolean = false,
    public attachedWashroom: boolean = false,
    public balconyAvailable: boolean = false,
    public airConditioned: boolean = false,
    public bedType: string = '',
    public mattressProvided: boolean = false,
    public studyTableAvailable: boolean = false,
    public foodProvided: boolean = false,
    public mealTypes: string = '',
    public foodOptions: string = '',
    public cookingAllowed: boolean = false,
    public commonKitchenAccess: boolean = false,
    public fridgeAvailable: boolean = false,
    public microwaveAvailable: boolean = false,
    public wifiAvailable: boolean = false,
    public powerBackupAvailable: boolean = false,
    public geyserAvailable: boolean = false,
    public washingMachineAvailable: boolean = false,
    public housekeepingFrequency: string = '',
    public cctvSurveillance: boolean = false,
    public securityGuardAvailable: boolean = false,
    public liftAvailable: boolean = false,
    public twoWheelerParking: boolean = false,
    public fourWheelerParking: boolean = false,
    public loungeAvailable: boolean = false,
    public recreationAreaAvailable: boolean = false,
    public gymAvailable: boolean = false,
    public rooftopAccess: boolean = false,
    public dailyCleaning: boolean = false,
    public laundryService: boolean = false,
    public maintenanceOnCall: boolean = false,
    public waterPurifierAvailable: boolean = false,
    public dispenserAvailable: boolean = false,
    public entryExitTimings: string = '',
    public visitorsAllowed: boolean = false,
    public guestsOvernightAllowed: boolean = false,
    public securityDepositAmount: number = 0,
    public idVerificationRequired: boolean = false,
    public fireSafetyAvailable: boolean = false,
    public smokingAllowed: boolean = false,
    public petsAllowed: boolean = false,
    public alcoholAllowed: boolean = false,
    public monthlyRent: number = 0,
    public depositAmount: number = 0,
    public noticePeriodDays: number = 0,
    public lockInPeriodMonths: number = 0,
    public additionalChargesInfo: string = '',
    public maintenanceChargesInfo: string = '',
    public ownerName: string = '',
    public contactNumber: string = '',
    public whatsappNumber: string = '',
    public email: string = '',
    public visitingHours: string = '',
    public availabilityFor: string = '',
    public agreementType: string = '',
    public minimumStayMonths: number = 0,
    public noticePeriodToLeaveDays: number = 0,
    public refundPolicy: string = '',
    public houseRulesDocumentUrl: string = '',
    public specialOffers: string = '',
    public earlyBirdDiscounts: string = '',
    public referralBonuses: string = '',
    public immediatePossession: boolean = false,
    public availableFromDate: string = '',
    public waitingList: boolean = false,
    public totalRooms: number = 0,
    public availableRooms: number = 0,
    public sharingOptions: SharingOptionModel[] = [new SharingOptionModel()]
  ) {}
}

// ── Sharing Option Response ────────────────────────────────────────────────
export interface SharingOptionResponse {
  id: number;
  sharingType: string;
  label: string;
  persons: number;
  pricePerMonth: number;
  totalBeds: number;
  availableBeds: number;
  amenities: string[];
  isAvailable: boolean;
}

// ── Full PG Listing Response from Spring Boot ──────────────────────────────
export interface PgListingResponse {
  id: number;
  ownerId: number;
  pgName: string;
  fullAddress: string;
  city: string;
  locality: string;
  pinCode: string;
  googleMapLink: string;
  nearbyLandmarks: string;
  coverImageUrl: string;
  galleryImages: string[];
  virtualTourLink: string;
  videoLink: string;
  occupancyType: string;
  occupancyLabel: string;
  roomSizeSqFt: number;
  furnished: boolean;
  attachedWashroom: boolean;
  balconyAvailable: boolean;
  airConditioned: boolean;
  bedType: string;
  bedTypeLabel: string;
  mattressProvided: boolean;
  studyTableAvailable: boolean;
  foodProvided: boolean;
  mealTypes: string;
  foodOptions: string;
  cookingAllowed: boolean;
  commonKitchenAccess: boolean;
  fridgeAvailable: boolean;
  microwaveAvailable: boolean;
  wifiAvailable: boolean;
  powerBackupAvailable: boolean;
  geyserAvailable: boolean;
  washingMachineAvailable: boolean;
  housekeepingFrequency: string;
  housekeepingLabel: string;
  cctvSurveillance: boolean;
  securityGuardAvailable: boolean;
  liftAvailable: boolean;
  twoWheelerParking: boolean;
  fourWheelerParking: boolean;
  loungeAvailable: boolean;
  recreationAreaAvailable: boolean;
  gymAvailable: boolean;
  rooftopAccess: boolean;
  dailyCleaning: boolean;
  laundryService: boolean;
  maintenanceOnCall: boolean;
  waterPurifierAvailable: boolean;
  dispenserAvailable: boolean;
  entryExitTimings: string;
  visitorsAllowed: boolean;
  guestsOvernightAllowed: boolean;
  securityDepositAmount: number;
  idVerificationRequired: boolean;
  fireSafetyAvailable: boolean;
  smokingAllowed: boolean;
  petsAllowed: boolean;
  alcoholAllowed: boolean;
  lowestPrice: number;
  depositAmount: number;
  noticePeriodDays: number;
  lockInPeriodMonths: number;
  additionalChargesInfo: string;
  maintenanceChargesInfo: string;
  ownerName: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  visitingHours: string;
  availabilityFor: string;
  availabilityLabel: string;
  agreementType: string;
  agreementLabel: string;
  minimumStayMonths: number;
  noticePeriodToLeaveDays: number;
  refundPolicy: string;
  houseRulesDocumentUrl: string;
  specialOffers: string;
  earlyBirdDiscounts: string;
  referralBonuses: string;
  immediatePossession: boolean;
  availableFromDate: string;
  waitingList: boolean;
  totalRooms: number;
  availableRooms: number;
  isActive: boolean;
  isVerified: boolean;
  isBrandNew: boolean;
  isPartnerVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  sharingOptions: SharingOptionResponse[];
}