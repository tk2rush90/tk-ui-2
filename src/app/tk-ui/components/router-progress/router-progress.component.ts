import {ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';
import {
  ActivationEnd,
  ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RoutesRecognized
} from '@angular/router';
import {SubscriptionService} from '@tk-ui/services/common/subscription.service';
import {animate, AnimationEvent, state, style, transition, trigger} from '@angular/animations';

/**
 * This will show progress bar according to router progress.
 * It should be placed on the Application root.
 */
@Component({
  selector: 'app-router-progress',
  templateUrl: './router-progress.component.html',
  styleUrls: ['./router-progress.component.scss'],
  providers: [
    SubscriptionService,
  ],
  animations: [
    trigger('progress', [
      state('void', style({ width: '0' })),
      state('NavigationStart', style({ width: 'calc(100% / 12 * 1)' })),
      state('RouteConfigLoadStart', style({ width: 'calc(100% / 12 * 2)' })),
      state('RouteConfigLoadEnd', style({ width: 'calc(100% / 12 * 3)' })),
      state('RoutesRecognized', style({ width: 'calc(100% / 12 * 4)' })),
      state('GuardsCheckStart', style({ width: 'calc(100% / 12 * 5)' })),
      state('ChildActivationStart', style({ width: 'calc(100% / 12 * 6)' })),
      state('ActivationStart', style({ width: 'calc(100% / 12 * 7)' })),
      state('GuardsCheckEnd', style({ width: 'calc(100% / 12 * 8)' })),
      state('ResolveStart', style({ width: 'calc(100% / 12 * 9)' })),
      state('ResolveEnd', style({ width: 'calc(100% / 12 * 10)' })),
      state('ChildActivationEnd', style({ width: 'calc(100% / 12 * 11)' })),
      state('ActivationEnd', style({ width: 'calc(100% / 12 * 12)' })),
      state('done', style({ width: 'calc(100% / 12 * 12)' })),
      transition('* => NavigationStart', animate('.15s')),
      transition('* => RouteConfigLoadStart', animate('.15s')),
      transition('* => RouteConfigLoadEnd', animate('.15s')),
      transition('* => RoutesRecognized', animate('.15s')),
      transition('* => GuardsCheckStart', animate('.15s')),
      transition('* => ChildActivationStart', animate('.15s')),
      transition('* => ActivationStart', animate('.15s')),
      transition('* => GuardsCheckEnd', animate('.15s')),
      transition('* => ResolveStart', animate('.15s')),
      transition('* => ResolveEnd', animate('.15s')),
      transition('* => ChildActivationEnd', animate('.15s')),
      transition('* => ActivationEnd', animate('.15s')),
      transition('* => done', animate('.15s')),
      transition('* => void', animate('0s')),
    ]),
    trigger('fade-out', [
      state('void', style({ opacity: 0 })),
      state('show', style({ opacity: 1 })),
      transition('* => show', animate('0s')),
      transition('* => void', animate('.3s')),
    ]),
  ],
})
export class RouterProgressComponent implements OnInit {
  /**
   * State of `progress` animation.
   */
  progress = 'void';

  /**
   * State of `fade-out` animation.
   */
  fadeOut = 'void';

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private subscriptionService: SubscriptionService,
  ) {
  }

  /**
   * Bind progressing state to class to display track background color.
   */
  @HostBinding('class.tk-progressing')
  get progressing(): boolean {
    return this.progress !== 'void';
  }

  ngOnInit(): void {
    this._subscribeRouterEvent();
  }

  /**
   * Hide the progress bar by setting `fadeOut` as `void` when `progress` animation to `done` state has done.
   * @param event - The `AnimationEvent`.
   */
  onProgressDone(event: AnimationEvent): void {
    if (event.toState === 'done') {
      this.fadeOut = 'void';
    }
  }

  /**
   * Reset the progress bar by setting `progress` as `void` when `fade-out` animation to `void` state has done.
   * @param event - The `AnimationEvent`.
   */
  onFadeOutDone(event: AnimationEvent): void {
    if (event.toState === 'void') {
      this.progress = 'void';
    }
  }

  /**
   * Subscribe router event to animate progress bar.
   */
  private _subscribeRouterEvent(): void {
    const sub = this.router.events
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.fadeOut = 'show';
          this.progress = 'NavigationStart';
        } else if (event instanceof RouteConfigLoadStart) {
          this.progress = 'RouteConfigLoadStart';
        } else if (event instanceof RouteConfigLoadEnd) {
          this.progress = 'RouteConfigLoadEnd';
        } else if (event instanceof RoutesRecognized) {
          this.progress = 'RoutesRecognized';
        } else if (event instanceof GuardsCheckStart) {
          this.progress = 'GuardsCheckStart';
        } else if (event instanceof ChildActivationStart) {
          this.progress = 'ChildActivationStart';
        } else if (event instanceof ActivationStart) {
          this.progress = 'ActivationStart';
        } else if (event instanceof GuardsCheckEnd) {
          this.progress = 'GuardsCheckEnd';
        } else if (event instanceof ResolveStart) {
          this.progress = 'ResolveStart';
        } else if (event instanceof ResolveEnd) {
          this.progress = 'ResolveEnd';
        } else if (event instanceof ChildActivationEnd) {
          this.progress = 'ChildActivationEnd';
        } else if (event instanceof ActivationEnd) {
          this.progress = 'ActivationEnd';
        } else if (
          event instanceof NavigationEnd
          || event instanceof NavigationCancel
          || event instanceof NavigationError
        ) {
          this.progress = 'done';
        }

        // To prevent `NG0100` error from `progressing` getter.
        this.changeDetectorRef.detectChanges();
      });

    this.subscriptionService.store('_subscribeRouterEvent', sub);
  }
}
