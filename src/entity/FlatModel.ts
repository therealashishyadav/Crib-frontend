export class FlatModel {
  constructor(
    public flatName: string = '',
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
    public bedrooms: number = 1,
    public bathrooms: number = 1,
    public squareFeet: number = 0,
    public floorNumber: number = 0,
    public totalFloors: number = 0,
    public furnishingStatus: string = 'SEMI_FURNISHED',
    public rentAmount: number = 0,
    public depositAmount: number = 0,
    public maintenanceAmount: number = 0,
    public availableFromDate: string = '',
    public immediatePossession: boolean = false,
    public amenities: string[] = [],
    public description: string = '',
    public nearbyFacilities: string = '',
    public ownerName: string = '',
    public contactNumber: string = '',
    public whatsappNumber: string = '',
    public email: string = '',
    public visitingHours: string = '',
    public entryExitTimings: string = '',
    public visitorsAllowed: boolean = true,
    public petsAllowed: boolean = false,
    public smokingAllowed: boolean = false,
    public alcoholAllowed: boolean = false,
    public parkingAvailable: boolean = false,
    public liftAvailable: boolean = false,
    public securityGuard: boolean = false,
    public cctvInstalled: boolean = false,
    public waterSupply24x7: boolean = true,
    public powerBackup: boolean = false,
    public noticePeriodDays: number = 30,
    public additionalChargesInfo: string = ''
  ) {}
}

export interface FlatResponse {
  id: number;
  ownerId: number;
  flatName: string;
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
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  floorNumber: number;
  totalFloors: number;
  furnishingStatus: string;
  rentAmount: number;
  depositAmount: number;
  maintenanceAmount: number;
  availableFromDate: string;
  immediatePossession: boolean;
  amenities: string[];
  description: string;
  nearbyFacilities: string;
  ownerName: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  visitingHours: string;
  entryExitTimings: string;
  visitorsAllowed: boolean;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  alcoholAllowed: boolean;
  parkingAvailable: boolean;
  liftAvailable: boolean;
  securityGuard: boolean;
  cctvInstalled: boolean;
  waterSupply24x7: boolean;
  powerBackup: boolean;
  noticePeriodDays: number;
  additionalChargesInfo: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}