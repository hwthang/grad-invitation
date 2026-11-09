import { Directive, ElementRef, inject, input } from '@angular/core';

/** Swaps in a fallback source (once) when an image fails to load. */
@Directive({
  selector: 'img[appImageFallback]',
  host: { '(error)': 'onError()' },
})
export class ImageFallbackDirective {
  readonly appImageFallback = input.required<string>();

  private readonly img = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  private used = false;

  protected onError(): void {
    if (this.used) return;
    this.used = true;
    this.img.src = this.appImageFallback();
  }
}
