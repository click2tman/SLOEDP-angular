import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[defaultImg]'
})
export class ImageDefaultDirective implements OnInit {
    private defaultImgSrc = 'assets/imgs/avatar.png';

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  
    ngOnInit(): void {
      this.renderer.listen(this.elementRef.nativeElement, 'error', () => {
        this.setFallbackImage();
      });
    }
  
    private setFallbackImage(): void {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'src', this.defaultImgSrc);
    }
}
