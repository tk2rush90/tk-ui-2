import {Directive, HostBinding} from '@angular/core';

/**
 * Set `rel` and `target` properties for anchor
 * which navigates to outer link of the application.
 */
@Directive({
  selector: 'a[appOuterLink]'
})
export class OuterLinkDirective {
  /**
   * Bind target attribute to open link from another window.
   */
  @HostBinding('attr.target') target = '_blank';

  /**
   * Bind rel attribute to make SEO bot can't follow the link.
   */
  @HostBinding('attr.rel') rel = 'nofollow noreferrer noopener';
}
