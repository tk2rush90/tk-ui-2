import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputOverlay} from './input-overlay.component';

describe('InputOverlayComponent', () => {
  let component: InputOverlay;
  let fixture: ComponentFixture<InputOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputOverlay ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
