import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOutletComponent } from './message-outlet.component';

describe('MessageOutletComponent', () => {
  let component: MessageOutletComponent;
  let fixture: ComponentFixture<MessageOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
