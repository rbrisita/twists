import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit
} from '@angular/core';

import '../../../node_modules/foundation-sites/dist/js/foundation';

@Component({
    selector: 'app-header',
    templateUrl: './views/header.component.html',
})
export class HeaderComponent implements OnDestroy, OnInit {

    constructor(private element: ElementRef) { }

    ngOnInit() {
        this.handleHeaderWidth();

        setImmediate(() => {
            // Remove tabindex to eliminate focus on header menu options.
            const arr: Element[] = this.element.nativeElement.querySelectorAll('li > a');
            arr.forEach((item) => {
                item.removeAttribute('tabindex');
            });
        });

        this.listenToResize();
    }

    ngOnDestroy() {
        window.removeEventListener('resize', this.handleHeaderWidth);
    }

    private listenToResize(): void {
        window.addEventListener('resize', this.handleHeaderWidth);
    }

    /**
     * Adjust max width of header to keep a consistent look.
     */
    private handleHeaderWidth(): void {
        const container: HTMLElement | null = document.querySelector('.sticky-container');
        if (!container) {
            console.error('No container');
            return;
        }

        const width: number = container.getBoundingClientRect().width;
        const comp: CSSStyleDeclaration = window.getComputedStyle(container);
        const pdngl: number = parseInt(comp['padding-left'], 10);
        const pdngr: number = parseInt(comp['padding-right'], 10);

        const header: HTMLElement | null = document.querySelector('header');
        if (!header) {
            console.error('No header');
            return;
        }

        let max_width: number = (width - pdngl - pdngr);
        let unit: string = 'px';
        if (Foundation.MediaQuery.current === 'small') {
            max_width = 100;
            unit = '%';
        }
        header.setAttribute('style', 'max-width:' + max_width + unit);
    }
}
