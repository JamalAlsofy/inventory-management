// src/app/shared/directives/highlight-qty.directive.ts
import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({ selector: '[appHighlightQty]' })
export class HighlightQtyDirective implements OnChanges {
  @Input('appHighlightQty') qty!: number;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const el: HTMLElement = this.el.nativeElement;
    el.classList.remove('bg-green-50','bg-yellow-50','bg-orange-50','bg-red-50','text-green-800','text-yellow-800','text-orange-800','text-red-800');
    if (this.qty > 50) el.classList.add('bg-green-50','text-green-800');       
    else if (this.qty > 20) el.classList.add('bg-yellow-50','text-yellow-800'); 
    else if (this.qty > 0) el.classList.add('bg-orange-50','text-orange-800');  // Critical
    else el.classList.add('bg-red-50','text-red-800');                         // Out of stock
  }
}
