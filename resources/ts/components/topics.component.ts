import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';
import '../../../node_modules/foundation-sites/dist/js/foundation';

import { AnalyticsService } from '../services/analytics.service';
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
    favorite_topics: Topic[];

    /**
     * Exposed to component HTML template to style selected topic.
     */
    selected_topic_id: number | null;

    private subscription_topics: Subscription;

    /**
     * Touch context members.
     */
    private touch_elem: Element;
    private touch_end_context: any;
    private touch_move_context: any;
    private touch_topic: Topic | null;

    constructor(
        private analytics_service: AnalyticsService,
        private change_detector: ChangeDetectorRef,
        private twist_service: TwistService
    ) {
        this.favorite_topics = [];
        this.selected_topic_id = null;
        this.subscription_topics = EMPTY.subscribe();

        this.touch_elem = document.createElement('object');
        this.touch_end_context = this.handleTouchEnd.bind(this);
        this.touch_move_context = this.handleTouchMove.bind(this);
        this.touch_topic = null;
    }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getFavoriteTopics().subscribe(favorite_topics => {
            this.favorite_topics = favorite_topics;
            this.change_detector.detectChanges();

            if (this.favorite_topics.length) {
                // Dont' load default topic if one is already selected.
                if (!document.querySelector('app-topics > ul > li.menu__item--selected')) {
                    setTimeout(() => {
                        this.loadTopic(new Event('test'), this.favorite_topics[0]);
                    });
                }
            } else {
                this.selected_topic_id = null;
                this.twist_service.noTopicSelected();
                this.twist_service.hasSeenIntro().subscribe((seen) => {
                    let overlay_id: string = seen ? '#favorites' : '#intro';

                    setImmediate(() => {
                        // Prevent double opening
                        if ($(overlay_id).css('display') === 'none') {
                            $(overlay_id).foundation('open');
                        }
                    });
                });
            }
        });
    }

    /**
     * Monitor other touch events to proceed with loading topic or not.
     * @param event Touch start event.
     * @param topic Topic that was touched.
     */
    handleTouchStart(event: TouchEvent, topic: Topic): void {
        event.preventDefault();

        console.log(`handleTouchStart: ${event.type} on ${((event.target) as HTMLElement).textContent}`);

        this.touch_topic = topic;

        this.touch_elem = event.target as Element;
        if (this.touch_elem) {
            this.touch_elem.addEventListener('touchmove', this.touch_move_context);
            this.touch_elem.addEventListener('touchend', this.touch_end_context);
        }
    }

    /**
     * Cancel other events as this is an invalid event for touching a topic.
     * @param event Touch move event.
     */
    handleTouchMove(event: Event): void {
        event.preventDefault();
        console.log(`handleTouchMove: ${event.type} on ${((event.target) as HTMLElement).textContent}`);

        this.touch_topic = null;

        this.touch_elem.removeEventListener('touchend', this.touch_end_context);
        this.touch_elem.removeEventListener('touchmove', this.touch_move_context);
    }

    /**
     * Proceed with loading the topic that was touch on the touch start event.
     * @param event Touch end event.
     */
    handleTouchEnd(event: Event): void {
        event.preventDefault();
        console.log(`handleTouchEnd: ${event.type} on ${((event.target) as HTMLElement).textContent}`);

        this.touch_elem.removeEventListener('touchend', this.touch_end_context);
        this.touch_elem.removeEventListener('touchmove', this.touch_move_context);

        if (this.touch_topic) {
            this.loadTopic(event, this.touch_topic);
            this.touch_topic = null;
        }
    }

    /**
     * Load topic if it is not currently selected from the service and has lists.
     * Exposed to HTML template.
     * @param topic Topic to load from the service.
     */
    loadTopic(event: Event, topic: Topic): void {
        event.preventDefault();

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

        this.analytics_service.selectTopic(topic);
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
    }
}
