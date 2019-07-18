import { Component } from '@angular/core';

import { TopicsComponent } from './topics.component';

/**
 * Display given topics for user selection.
 */
@Component({
    selector: 'app-topics-overlay',
    templateUrl: './views/topics-overlay.component.html',
})
export class TopicsOverlayComponent extends TopicsComponent { }
