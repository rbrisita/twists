import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';
import '../../../node_modules/foundation-sites/dist/js/foundation';

import { List } from '../models/list';
import { ListWidgetIdPipe } from '../pipes/list_widget-id.pipe';
import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display given lists for user selection.
 */
@Component({
    selector: 'app-lists',
    templateUrl: './views/lists.component.html',
    providers: [
        ListWidgetIdPipe
    ]
})
export class ListsComponent implements OnDestroy, OnInit {
    /**
     * List array to be parsed into a selectable menu.
     * Exposed to component HTML template.
     */
    lists: List[];

    /**
     * List to style selected list.
     * Exposed to component HTML template.
     */
    selected_list: List | null;

    private subscription_selected_topic: Subscription;
    private subscription_selected_list: Subscription;

    constructor(private twist_service: TwistService, private list_widget_id_pipe: ListWidgetIdPipe) {
        this.lists = [];
        this.selected_list = null;
        this.subscription_selected_topic = EMPTY.subscribe();
        this.subscription_selected_list = EMPTY.subscribe();
    }

    ngOnInit(): void {
        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe((topic: Topic) => {
            if (!topic) {
                this.lists = [];
                this.selected_list = null;
                return;
            }

            this.lists = topic.lists;
            this.selected_list = this.lists[0];
        });

        this.subscription_selected_list = this.twist_service.getSelectedList().subscribe((list: List) => {
            this.selected_list = list;
        });
    }

    /**
     * Scroll to given list.
     * Exposed to HTML template.
     * @param list List to scroll to.
     */
    scrollToList(list: List): void {
        const widget_id: string = this.list_widget_id_pipe.transform(list);

        const el: HTMLElement | null = document.querySelector('[data-widget-id="' + widget_id + '"]');
        if (el) {
            this.scrollToElement(el);
        }
    }

    private scrollToElement(el: HTMLElement): void {
        const height: number = this.getHeightAdjustment();

        const rect: DOMRect | ClientRect = el.getBoundingClientRect();
        const top: number = window.scrollY + rect.top;
        window.scrollTo({
            top: (top - height),
            left: rect.left,
            behavior: 'smooth'
        });
    }

    /**
     * Return height of header and other menu bars depending on view.
     */
    private getHeightAdjustment(): number {
        let height: number = 0;

        const header: HTMLElement | null = document.querySelector('header');
        if (header) {
            height = header.scrollHeight;
        }

        if (Foundation.MediaQuery.current === 'small') {
            const topics: HTMLElement | null = document.querySelector('app-topics > ul');
            if (topics) {
                height += topics.scrollHeight;
            }
        }

        return height;
    }

    ngOnDestroy(): void {
        this.subscription_selected_topic.unsubscribe();
        this.subscription_selected_list.unsubscribe();
    }
}
