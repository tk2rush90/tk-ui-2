import {AfterViewInit, Component, OnDestroy, ViewChild, ViewContainerRef} from '@angular/core';
import {RandomUtil} from '@tk-ui/utils/random.util';
import {OverlayService} from '@tk-ui/components/overlay/overlay.service';

/**
 * The outlet to draw overlay contents.
 * A single overlay outlet can draw a single component.
 */
@Component({
  selector: 'app-overlay-outlet',
  templateUrl: './overlay-outlet.component.html',
  styleUrls: ['./overlay-outlet.component.scss']
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
    private overlayService: OverlayService,
  ) { }

  ngAfterViewInit(): void {
    this.overlayService.appendOverlayOutlet(this);
  }

  ngOnDestroy(): void {
    this.overlayService.removeOverlayOutlet(this);
  }
}
