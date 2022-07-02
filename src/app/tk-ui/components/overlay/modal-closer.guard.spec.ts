import {TestBed} from '@angular/core/testing';

import {OverlayCloserGuard} from './overlay-closer-guard.service';

describe('ModalCloserGuard', () => {
  let guard: OverlayCloserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OverlayCloserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
