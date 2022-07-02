import {
  AfterViewInit,
  Component,
  HostBinding,
  HostListener,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {OverlayService} from '@tk-ui/components/overlay/overlay.service';
import {AvailableKey, EventUtil} from '@tk-ui/utils/event.util';
import {Router} from '@angular/router';

/**
 * An outlet to render overlay component.
 */
@Component({
  selector: 'app-overlay-outlet',
  templateUrl: './overlay-outlet.component.html',
  styleUrls: ['./overlay-outlet.component.scss'],
})
export class OverlayOutletComponent implements AfterViewInit, OnDestroy {
  /**
   * `ViewContainerRef` of `<ng-container>` to render overlay contents.
   */
  @ViewChild('container', {read: ViewContainerRef}) viewContainerRef!: ViewContainerRef;

  /**
   * Random id of OverlayOutlet.
   */
  id = RandomUtil.key();

  constructor(
    private _router: Router,
    private _overlayService: OverlayService,
  ) { }

  /**
   * Bind opened state to class.
   */
  @HostBinding('class.tk-has-opened')
  get hasOpened(): boolean {
    return this._overlayService.hasOpenedOverlays;
  }

  ngAfterViewInit(): void {
    this._overlayService.registerOverlayOutlet(this);
  }

  ngOnDestroy(): void {
    this._overlayService.unregisterOverlayOutlet();
  }

  /**
   * Listen window keydown event to close the latest outlet.
   * @param event - The `KeyboardEvent`.
   */
  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if (EventUtil.isKey(event, AvailableKey.Escape)) {
      this._overlayService.closeLatest();
    }
  }
}
