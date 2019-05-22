import {
    Component,
    OnInit
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

@Component({
    selector: 'app-header',
    templateUrl: './views/header.component.html',
    animations: [
        trigger('fade', [
            state('hidden', style({ opacity: 0 })),
            state('shown', style({ opacity: 1 })),
            transition('hidden => shown', [animate('500ms')])
        ])
    ]
})
export class HeaderComponent implements OnInit {
    fade_state: string;

    constructor() {
        this.fade_state = 'hidden';
    }

    ngOnInit() {
        setTimeout(() => {
            this.fade_state = 'shown';
        });
    }
}
