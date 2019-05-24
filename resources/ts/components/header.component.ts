import {
    Component,
    ElementRef,
    OnInit
} from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './views/header.component.html',
})
export class HeaderComponent implements OnInit {

    constructor(private element: ElementRef) { }

    ngOnInit() {
        setImmediate(() => {
            // Remove tabindex to eliminate focus on header menu options.
            const arr: Element[] = this.element.nativeElement.querySelectorAll('li > a');
            arr.forEach((item) => {
                item.removeAttribute('tabindex');
            });
        });
    }
}
