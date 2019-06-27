import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'app-error',
    templateUrl: './views/error.component.html'
})
export class ErrorComponent implements OnDestroy, OnInit {
    constructor(private analytics_service: AnalyticsService) { }

    ngOnInit(): void {
        // Using jQuery because events are outside of what Angular is expecting.
        $('#error').on('open.zf.reveal', this.handleOpen.bind(this));
    }

    ngOnDestroy(): void {
        // Using jQuery because events are outside of what Angular is expecting.
        $('#intro').off('open.zf.reveal', this.handleOpen.bind(this));
    }

    private handleOpen(): void {
        this.analytics_service.viewError();
    }
}
