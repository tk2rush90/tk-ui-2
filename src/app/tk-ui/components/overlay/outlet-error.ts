export function throwOutletAlreadyRegistered(): void {
  throw new Error('Only a single overlay outlet can be registered');
}

export function throwNoViewContainerRef(): void {
  throw new Error('No `ViewContainerRef` to open overlay. Maybe overlay outlet is not registered.');
}
