import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestModuleComponent} from './test-module.component';


@NgModule({
  declarations: [
    TestModuleComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TestModuleComponent
  ],
  providers: [
  ]
})
export class TestModuleModule { }
