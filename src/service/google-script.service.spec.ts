import { TestBed } from '@angular/core/testing';

import { GoogleScriptService } from './google-script.service';

describe('GoogleScriptService', () => {
  let service: GoogleScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
