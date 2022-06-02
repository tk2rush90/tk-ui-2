import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileDropzoneDirective} from './file-dropzone.directive';


@NgModule({
  declarations: [
    FileDropzoneDirective
  ],
  exports: [
    FileDropzoneDirective
  ],
  imports: [
    CommonModule
  ]
})
export class FileDropzoneModule {
}
