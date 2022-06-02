import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectOptionsComponent } from './multi-select-options.component';

describe('MultiSelectOptionsComponent', () => {
  let component: MultiSelectOptionsComponent;
  let fixture: ComponentFixture<MultiSelectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
