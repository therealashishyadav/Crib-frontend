export class PlatformSettings {
  featuredListings: number[] = [];
  cities: string[] = [];
  localities: string[] = [];
  announcementTitle = '';
  announcementMessage = '';

  get featuredListingsStr(): string { return this.featuredListings.join(','); }
  set featuredListingsStr(val: string) { this.featuredListings = val.split(',').filter(v => v.trim()).map(Number); }
  get citiesStr(): string { return this.cities.join(','); }
  set citiesStr(val: string) { this.cities = val.split(',').map(c => c.trim()).filter(c => c); }
  get localitiesStr(): string { return this.localities.join(','); }
  set localitiesStr(val: string) { this.localities = val.split(',').map(l => l.trim()).filter(l => l); }
}