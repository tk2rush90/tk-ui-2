import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestPageComponent} from './pages/test-page/test-page.component';
import {TestNextPageComponent} from './pages/test-next-page/test-next-page.component';
import {OverlayCloserGuard} from '@tk-ui/components/overlay/overlay-closer-guard.service';

const routes: Routes = [
  {
    path: '',
    component: TestPageComponent,
    canDeactivate: [
      OverlayCloserGuard,
    ],
  },
  {
    path: 'next',
    component: TestNextPageComponent,
    canDeactivate: [
      OverlayCloserGuard,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
