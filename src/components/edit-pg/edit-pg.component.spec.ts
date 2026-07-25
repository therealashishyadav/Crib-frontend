import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPgComponent } from './edit-pg.component';

describe('EditPgComponent', () => {
  let component: EditPgComponent;
  let fixture: ComponentFixture<EditPgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
