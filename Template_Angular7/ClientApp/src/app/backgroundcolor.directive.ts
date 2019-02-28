import {AfterViewInit, Directive, OnDestroy} from '@angular/core';

@Directive({
  selector: '[bgcolorDirective]'
})

export class BackgroundcolorDirective implements OnDestroy, AfterViewInit {

  ngAfterViewInit() {
    document.querySelector('body').classList.add('bgcolor');

  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('bgcolor');
  }
}
