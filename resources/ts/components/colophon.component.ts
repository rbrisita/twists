import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';

@Component({
    selector: 'app-colophon',
    templateUrl: './views/colophon.component.html'
})
export class ColophonComponent implements OnDestroy, OnInit {
    constructor(private analytics_service: AnalyticsService) { }

    ngOnInit(): void {
        $('#colophon').on('open.zf.reveal', this.handleOpen.bind(this));
    }

    ngOnDestroy(): void {
        $('#colophon').off('open.zf.reveal', this.handleOpen.bind(this));
    }

    private handleOpen(): void {
        this.analytics_service.viewColophon();
    }
}
