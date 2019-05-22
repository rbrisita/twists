import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

import { Subscription } from 'rxjs';

import { List } from '../models/list';
import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display given topics and lists for user selection.
 */
@Component({
    selector: 'app-menu',
    templateUrl: './views/menu.component.html',
    animations: [
        trigger('fade', [
            state('hidden', style({ opacity: 0 })),
            state('shown', style({ opacity: 1 })),
            transition('hidden => shown', [animate('500ms')])
        ])
    ]
})
export class MenuComponent implements OnDestroy, OnInit {
    topics: Topic[];
    lists: List[];
    fade_state: string;

    private selected_topic_id: number;
    private subscription_topics: Subscription;
    private subscription_selected_topic: Subscription;

    constructor(private twist_service: TwistService) {
        this.fade_state = 'hidden';
    }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getAllTopics().subscribe(topics => {
            this.topics = topics;
        });
        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.lists = topic.lists;
        });

        setTimeout(() => {
            this.fade_state = 'shown';
            this.loadTopic(0);
        });
    }

    loadTopic(id: number): void {
        if (this.selected_topic_id !== id) {
            this.selected_topic_id = id;
            this.twist_service.loadTopic(id);
        }
    }

    scrollToList(widget_id: string): void {
        const el: HTMLElement | null = document.querySelector('[data-widget-id="' + widget_id + '"]');
        if (el) {
            let height: number = 0;
            const header: HTMLElement | null = document.querySelector('header');
            if (header) {
                height = header.offsetHeight;
            }

            const rect: DOMRect | ClientRect = el.getBoundingClientRect();
            let top: number = window.scrollY + rect.top;
            window.scrollTo({
                top: (top - height),
                left: rect.left,
                behavior: 'smooth'
            });
        }
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
        this.subscription_selected_topic.unsubscribe();
    }
}
