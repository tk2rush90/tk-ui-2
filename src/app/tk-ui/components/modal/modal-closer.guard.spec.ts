import { TestBed } from '@angular/core/testing';

import { ModalCloserGuard } from './modal-closer.guard';

describe('ModalCloserGuard', () => {
  let guard: ModalCloserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ModalCloserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
