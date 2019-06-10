import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';
import '../../../node_modules/foundation-sites/dist/js/foundation';

import { List } from '../models/list';
import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display given lists for user selection.
 */
@Component({
    selector: 'app-lists',
    templateUrl: './views/lists.component.html',
})
export class ListsComponent implements OnDestroy, OnInit {
    /**
     * Exposed to component HTML template to be parsed into a selectable menu.
     */
    lists: List[];

    /**
     * Exposed to component HTML template to style selected list.
     */
    selected_list: List;

    private subscription_selected_topic: Subscription;

    constructor(private twist_service: TwistService) {
        this.lists = [];
        this.selected_list = {
            owner_screen_name: '',
            name: ''
        };
        this.subscription_selected_topic = EMPTY.subscribe();
    }

    ngOnInit(): void {
        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe((topic: Topic) => {
            this.lists = topic.lists;
            this.selected_list = topic.lists[0];
        });
    }

    /**
     * Scroll to given list.
     * Exposed to HTML template.
     * @param list List to scroll to.
     */
    scrollToList(list: List): void {
        let list_name: string = list.name.toLowerCase().replace(/\s*\W+/, '_');
        const widget_id = 'list:' + list.owner_screen_name + ':' + list_name;

        const el: HTMLElement | null = document.querySelector('[data-widget-id="' + widget_id + '"]');
        if (el) {
            this.selected_list = list;
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
    }
}
