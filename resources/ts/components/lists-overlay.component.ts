import { Component } from '@angular/core';

import { ListsComponent } from './lists.component';
import { ListWidgetIdPipe } from '../pipes/list_widget-id.pipe';

/**
 * Display given lists for user selection.
 */
@Component({
    selector: 'app-lists-overlay',
    templateUrl: './views/lists-overlay.component.html',
    providers: [
        ListWidgetIdPipe
    ]
})
export class ListsOverlayComponent extends ListsComponent { }
