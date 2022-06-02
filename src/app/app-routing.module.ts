import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestPageComponent} from './pages/test-page/test-page.component';
import {TestNextPageComponent} from './pages/test-next-page/test-next-page.component';

const routes: Routes = [
  {
    path: '',
    component: TestPageComponent,
  },
  {
    path: 'next',
    component: TestNextPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
