import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestNextPageComponent } from './test-next-page.component';

describe('TestNextPageComponent', () => {
  let component: TestNextPageComponent;
  let fixture: ComponentFixture<TestNextPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestNextPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNextPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
