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
    /**
     * Exposed to component HTML template to be parsed into a selectable menu.
     */
    topics: Topic[];

    /**
     * Exposed to component HTML template to style selected topic.
     */
    selected_topic_id: number;

    private subscription_topics: Subscription;

    constructor(private twist_service: TwistService) {
        this.topics = [];
        this.selected_topic_id = -1;
        this.subscription_topics = EMPTY.subscribe();
    }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getFavoriteTopics().subscribe(topics => {
            this.topics = topics;

            if (this.topics.length) {
                setTimeout(() => {
                    this.loadTopic(this.topics[0]);
                });
            } else {
                setImmediate(() => {
                    // Prevent double opening
                    if ($('#favorites').css('display') === 'none') {
                        $('#favorites').foundation('open');
                    }
                });
            }
        });
    }

    /**
     * Load topic if it is not currently selected from the service and has lists.
     * Exposed to HTML template.
     * @param topic Topic to load from the service.
     */
    loadTopic(topic: Topic): void {
        const id = topic.id;
        if (this.selected_topic_id === id && Foundation.MediaQuery.current === 'small') {
            $('#off-canvas').foundation('toggle');
            return;
        }

        this.selected_topic_id = id;

        // Make sure the view is scrolled to the top.
        if (window.scrollY) {
            const scroll_listener = () => {
                if (window.scrollY === 0) {
                    window.removeEventListener('scroll', scroll_listener, false);
                    this.twist_service.loadTopicById(id);
                }
            };
            window.addEventListener('scroll', scroll_listener, false);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            this.twist_service.loadTopicById(id);
        }
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
    }
}
