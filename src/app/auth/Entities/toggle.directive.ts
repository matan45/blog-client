import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[toggle]'
})
export class ToggleDirective {
  private _shown = false;

  constructor(private el: ElementRef) {
    const parent = this.el.nativeElement.parentNode;
    const span = document.createElement('label');
    span.innerHTML = '<i class="btn btn-outline-info mt-2 fa fa-eye" aria-hidden="true"></i>';
    span.addEventListener('click', () => {
      this.toggle(span);
    });
    parent.appendChild(span);
  }

  toggle(span: HTMLElement) {
    this._shown = !this._shown;
    if (this._shown) {
      this.el.nativeElement.setAttribute('type', 'text');
      span.innerHTML = '<i class="btn btn-outline-info mt-2 fa fa-eye" aria-hidden="true"></i>';
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      span.innerHTML = '<i class="btn btn-outline-info mt-2 fa fa-eye" aria-hidden="true"></i>';
    }
  }

}
