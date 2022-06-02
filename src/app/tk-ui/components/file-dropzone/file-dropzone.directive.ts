import {Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnDestroy, Output} from '@angular/core';
import {EventUtil} from '@tk-ui/utils/event.util';

/**
 * Mime types are consist of `${type}/${sub-type}`.
 * This object maps mime types of `accept` field.
 */
export interface MimeTypesMap {
  [type: string]: {
    [subtype: string]: boolean;
  }
}

/**
 * The directive to create file dropzone.
 */
@Directive({
  selector: '[appFileDropzone]'
})
export class FileDropzoneDirective implements OnDestroy {
  /**
   * Set acceptable file types.
   * Should be an array of mime types.
   */
  @Input() accept: string[] = [
    '*/*',
  ];

  /**
   * Emit uploaded files as an array.
   */
  @Output() success = new EventEmitter<File[]>();

  /**
   * Emit error message.
   */
  @Output() error = new EventEmitter<string>();

  /**
   * Dropzone activated state.
   */
  @HostBinding('class.active') active = false;

  /**
   * File input element.
   */
  private _input?: HTMLInputElement;

  constructor() {
  }

  ngOnDestroy(): void {
    this._removeInputChangeEvent();
  }

  /**
   * Get state of allowing multiple files.
   */
  get multi(): boolean {
    return this._input?.hasAttribute('multi') || false;
  }

  /**
   * Map the `accept` field with `type` and `subtype`.
   */
  get mimeTypesMap(): MimeTypesMap {
    const mimeTypesMap: MimeTypesMap = {};

    this.accept.forEach(mimeType => {
      const [type, subtype] = mimeType.split('/');

      if (!mimeTypesMap[type]) {
        mimeTypesMap[type] = {};
      }

      if (!mimeTypesMap[type][subtype]) {
        mimeTypesMap[type][subtype] = true;
      }
    });

    return mimeTypesMap;
  }

  /**
   * Set file input element.
   * If the `input` is an instance of `ElementRef`, extract `nativeElement` from it.
   * @param input - Input element.
   */
  @Input() set input(input: HTMLInputElement | ElementRef<HTMLInputElement>) {
    this._removeInputChangeEvent();

    if (input instanceof ElementRef) {
      this._input = input.nativeElement;
    } else {
      this._input = input;
    }

    this._addInputChangeListener();
  }

  /**
   * It should be disabled to make file dropzone.
   * @param event - The `DragEvent`.
   */
  @HostListener('window:dragover', ['$event'])
  onWindowDragover(event: DragEvent): void {
    EventUtil.disable(event);
  }

  /**
   * It should be disabled to make file dropzone.
   * @param event - The `DragEvent`.
   */
  @HostListener('window:drop', ['$event'])
  onWindowDrop(event: DragEvent): void {
    EventUtil.disable(event);
  }

  /**
   * Set dropzone active state.
   */
  @HostListener('dragover')
  onHostDragOver(): void {
    this.active = true;
  }

  /**
   * Unset dropzone active state.
   */
  @HostListener('dragleave')
  onHostDragLeave(): void {
    this.active = false;
  }

  /**
   * Unset dropzone active state.
   */
  @HostListener('dragend')
  onHostDragEnd(): void {
    this.active = false;
  }

  /**
   * Handle `drop` on this dropzone.
   * @param event - DragEvent.
   */
  @HostListener('drop', ['$event'])
  onHostDrop(event: DragEvent): void {
    this.active = false;

    if (event.dataTransfer?.files) {
      this._handleFiles(event.dataTransfer.files);
    }
  }

  /**
   * Add `change` event listener to file input.
   */
  private _addInputChangeListener(): void {
    if (this._input) {
      this._input.addEventListener('change', this._onInputChange);
    }
  }

  /**
   * Remove `change` event listener from file input.
   */
  private _removeInputChangeEvent(): void {
    if (this._input) {
      this._input.removeEventListener('change', this._onInputChange);
    }
  }

  /**
   * The `change` event listener for file input.
   */
  private _onInputChange = (): void => {
    if (this._input?.files) {
      this._handleFiles(this._input.files);

      // Remove the value of file input.
      // This is to allow uploading of the same file(s).
      this._input.value = '';
    }
  }

  /**
   * Handle both `host.drop` and `input.change` event.
   * Validate file and emit `success` or `error` emitter based on the validation result.
   * @param files - Uploaded FileList.
   */
  private _handleFiles(files: FileList): void {
    try {
      this.success.emit(this._validateFiles(files));
    } catch (e) {
      this.error.emit((e as Error).message);
    }
  }

  /**
   * Validate the file length and types.
   * @param files - Uploaded FileList.
   */
  private _validateFiles(files: FileList): File[] {
    const mimeTypesMap = this.mimeTypesMap;
    const validatedFiles: File[] = [];

    // Check whether multiple files can be uploaded or not.
    if (!this.multi && files.length > 1) {
      throw new Error('Multi Error');
    }

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i) as File;

      const [type, subtype] = file.type.split('/');

      // Check Mimetype.
      // Since the first object can be `undefined`, `{}` is set as the default value of the first object.
      if (
        // If there is `*/*` in the `accept` field, all mimetypes are allowed to upload.
        // Other mimetypes are redundant if `*/*` is set in the `accept` field.
        (mimeTypesMap['*'] || {})['*']

        // Check `*` wildcard for specific type.
        // If the `accept` field is `['image/*', 'text/*'],
        // all images and texts are allowed to upload.
        || (mimeTypesMap[type] || {})['*']

        // Check specific type.
        // If the `accept` field is `['image/png', 'text/javascript']`,
        // only png images and javascript files are allowed to upload.
        || (mimeTypesMap[type] || {})[subtype]
      ) {
        validatedFiles.push(file);
      } else {
        throw new Error('Mimetype Error');
      }
    }

    return validatedFiles;
  }
}
