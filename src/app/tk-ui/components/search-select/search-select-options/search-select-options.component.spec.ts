import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectOptionsComponent } from './search-select-options.component';

describe('SearchSelectOptionsComponent', () => {
  let component: SearchSelectOptionsComponent;
  let fixture: ComponentFixture<SearchSelectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSelectOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
