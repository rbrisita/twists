import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit
} from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'app-about',
    templateUrl: './views/about.component.html'
})
export class AboutComponent implements OnDestroy, OnInit {
    constructor(
        private analytics_service: AnalyticsService,
        private elem_ref: ElementRef
    ) { }

    ngOnInit(): void {
        $('#about').on('open.zf.reveal', this.handleOpen.bind(this));

        twttr.ready((twitter: Twitter) => {
            // 'twttr.widgets.load' is a overload method.
            // @ts-ignore
            twitter.widgets.load(this.elem_ref.nativeElement.querySelector('#about'));
        });
    }

    ngOnDestroy(): void {
        $('#about').off('open.zf.reveal', this.handleOpen.bind(this));
    }

    private handleOpen(): void {
        this.analytics_service.viewAbout();
    }
}
