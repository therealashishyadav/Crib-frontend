import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentSheetComponent } from './rent-sheet.component';

describe('RentSheetComponent', () => {
  let component: RentSheetComponent;
  let fixture: ComponentFixture<RentSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
