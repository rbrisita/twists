import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import { List } from '../models/list';
import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display given topics and lists for user selection.
 */
@Component({
    selector: 'app-menu',
    templateUrl: './views/menu.component.html'
})
export class MenuComponent implements OnDestroy, OnInit {
    topics: Topic[];
    lists: List[];

    private selected_topic_id: number;
    private subscription_topics: Subscription;
    private subscription_selected_topic: Subscription;

    constructor(private twist_service: TwistService) { }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getAllTopics().subscribe(topics => {
            this.topics = topics;
        });
        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.lists = topic.lists;
        });

        this.loadTopic(0);
    }

    loadTopic(id: number): void {
        if (this.selected_topic_id !== id) {
            this.selected_topic_id = id;
            this.twist_service.loadTopic(id);
        }
    }

    scrollToList(widget_id: string): void {
        let el: Element | null = document.querySelector('[data-widget-id="' + widget_id + '"]');
        if (el) {
            el.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
        this.subscription_selected_topic.unsubscribe();
    }
}
