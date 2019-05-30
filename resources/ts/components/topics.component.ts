import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';
import '../../../node_modules/foundation-sites/dist/js/foundation';

import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display given topics for user selection.
 */
@Component({
    selector: 'app-topics',
    templateUrl: './views/topics.component.html',
})
export class TopicsComponent implements OnDestroy, OnInit {
    topics: Topic[];
    selected_topic_id: number | null;

    private subscription_topics: Subscription;

    constructor(private twist_service: TwistService) {
        this.topics = [];
        this.selected_topic_id = null;
        this.subscription_topics = EMPTY.subscribe();
    }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getAllTopics().subscribe(topics => {
            this.topics = topics;
        });

        setTimeout(() => {
            this.loadTopic(0);
        });
    }

    /**
     * Only load topic if it is not current from the service.
     * @param id Id of topic to load from the service.
     */
    loadTopic(id: number): void {
        if (this.selected_topic_id !== id) {
            this.selected_topic_id = id;

            // Make sure we view is all the way scrolled to the top.
            if (window.scrollY) {
                const scroll_listener = () => {
                    if (window.scrollY === 0) {
                        window.removeEventListener('scroll', scroll_listener, false);
                        this.twist_service.loadTopic(id);
                    }
                };
                window.addEventListener('scroll', scroll_listener, false);

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                this.twist_service.loadTopic(id);
            }
        } else if (Foundation.MediaQuery.current === 'small') {
            $('#off-canvas').foundation('toggle');
        }
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
    }
}
