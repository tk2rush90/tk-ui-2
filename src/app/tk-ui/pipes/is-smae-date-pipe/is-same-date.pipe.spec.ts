import { IsSameDatePipe } from './is-same-date.pipe';

describe('IsSameDatePipe', () => {
  it('create an instance', () => {
    const pipe = new IsSameDatePipe();
    expect(pipe).toBeTruthy();
  });
});
