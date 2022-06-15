import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayBackdropComponent } from './overlay-backdrop.component';

describe('OverlayBackdropComponent', () => {
  let component: OverlayBackdropComponent;
  let fixture: ComponentFixture<OverlayBackdropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayBackdropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayBackdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
