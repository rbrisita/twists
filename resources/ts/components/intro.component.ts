import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';
import { TwistService } from '../services/twist.service';

@Component({
    selector: 'app-intro',
    templateUrl: './views/intro.component.html'
})
export class IntroComponent implements OnDestroy, OnInit {
    constructor(
        private analytics_service: AnalyticsService,
        private twist_service: TwistService
    ) { }

    ngOnInit(): void {
        // Using jQuery because events are outside of what Angular is expecting.
        $('#intro').on('open.zf.reveal', this.handleOpen.bind(this));
        $('#intro').on('closed.zf.reveal', this.handleClose.bind(this));
    }

    ngOnDestroy(): void {
        // Using jQuery because events are outside of what Angular is expecting.
        $('#intro').off('open.zf.reveal', this.handleOpen.bind(this));
        $('#intro').off('closed.zf.reveal', this.handleClose.bind(this));
    }

    private handleOpen(): void {
        this.analytics_service.viewIntro();
    }

    /**
     * Modal closed, alert service, and show favorites.
     */
    private handleClose(): void {
        this.twist_service.seenIntro(true);
        setImmediate(() => {
            // Prevent double opening
            if ($('#favorites').css('display') === 'none') {
                $('#favorites').foundation('open');
            }
        });
    }
}
