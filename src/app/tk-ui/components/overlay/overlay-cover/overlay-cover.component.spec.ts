import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OverlayCoverComponent} from './overlay-cover.component';

describe('LayerCoverComponent', () => {
  let component: OverlayCoverComponent;
  let fixture: ComponentFixture<OverlayCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverlayCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlayCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
