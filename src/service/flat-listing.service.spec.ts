import { TestBed } from '@angular/core/testing';

import { FlatListingService } from './flat-listing.service';

describe('FlatListingService', () => {
  let service: FlatListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlatListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
