import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import { List } from '../models/list';
import { Topic } from '../models/topic'
import { TwistService } from '../services/twist.service';

/**
 * The Twists Component is a collection of loaded topics which contain lists.
 */
@Component({
    selector: 'app-twists',
    templateUrl: './views/twists.component.html'
})
export class TwistsComponent implements OnDestroy, OnInit {
    topic: Topic;
    lists: List[];

    private timelines: { [key: string]: HTMLIFrameElement[] };
    private subscription: Subscription;

    constructor(private twist_service: TwistService) {
        this.timelines = {};
    }

    ngOnInit(): void {
        this.listenToSaveLoadedTopic();

        this.subscription = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.hidePreviousTopic();

            this.topic = topic;
            if (this.showSavedTopic(topic.name)) {
                return;
            }

            // Load lists
            this.lists = topic.lists;
            setTimeout(() => {
                twttr.widgets.load();
            });
        });
    }

    /**
     * Listen to Twitter loaded event and save loaded timelines (widgets).
     */
    private listenToSaveLoadedTopic(): void {
        twttr.events.bind(
            'loaded',
            (event) => {
                event.widgets.forEach((widget: HTMLIFrameElement) => {
                    this.timelines[this.topic.name].push(widget);
                });
            }
        );
    }

    /**
     * Check to see if there was a previous topic selected.
     */
    private hidePreviousTopic(): void {
        if (this.topic) {
            const timelines = this.timelines[this.topic.name]
            if (timelines) {
                this.hideTimelines(timelines);
            }
        }
    }

    /**
     * Show given topic if it was saved prior.
     * @param topic_name Name of topic to check and show.
     * @returns True if given topic was shown.
     */
    private showSavedTopic(topic_name: string): boolean {
        const timelines = this.timelines[topic_name];
        if (timelines) {
            this.showTimelines(timelines);
            return true;
        }

        this.timelines[topic_name] = [];
        return false;
    }

    /**
     * Hide given timelines.
     * @param elems Array of HTMLIFrameElements to hide.
     */
    private hideTimelines(elems: HTMLIFrameElement[]): void {
        elems.forEach((el) => {
            el.style.display = 'none';
        });
    }

    /**
     * Show given timelines.
     * @param elems Array of HTMLIFrameElements to show.
     */
    private showTimelines(elems: HTMLIFrameElement[]): void {
        elems.forEach((el) => {
            el.style.display = 'inline-block';
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
