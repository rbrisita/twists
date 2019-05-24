import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import {
    animate,
    AnimationEvent,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

import { Subscription } from 'rxjs';

import { List } from '../models/list';
import { Topic } from '../models/topic'
import { TwistService } from '../services/twist.service';

/**
 * The Twists Component is a collection of loaded topics which contain lists.
 */
@Component({
    selector: 'app-twists',
    templateUrl: './views/twists.component.html',
    animations: [
        trigger('fade', [
            state('in', style({ opacity: 1 })),
            state('out', style({ opacity: 0 })),
            transition('in => out', [animate('500ms')]),
            transition('out => in', [animate('500ms')])
        ])
    ]
})
export class TwistsComponent implements OnDestroy, OnInit {
    topic: Topic;
    lists: List[];
    fade_state: string;
    fade_cb: (event: AnimationEvent) => void;

    private timelines: { [key: string]: HTMLIFrameElement[] };
    private subscription: Subscription;

    constructor(
        private renderer: Renderer2,
        private change_detector: ChangeDetectorRef,
        private twist_service: TwistService
    ) {
        this.timelines = {};
    }

    ngOnInit(): void {
        this.listenToSaveLoadedTopic();

        this.subscription = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.showLoader();

            const current_timelines: HTMLIFrameElement[] = this.getCurrentTimelines();
            const saved_timelines: HTMLIFrameElement[] = this.getSavedTopicTimelines(topic.name);

            this.topic = topic;

            if (current_timelines.length) {
                // We are currently showing timelines, start fading out, and hide them when done
                this.fade_cb = function (event: AnimationEvent) {
                    this.hideTimelines(current_timelines);

                    // We should be faded out now, show timelines and fade back in.
                    if (saved_timelines.length) {
                        this.showTimelines(saved_timelines);

                        this.fade_cb = function (event: AnimationEvent) {
                            this.hideLoader();
                        };
                        this.fade_state = 'in';
                    } else {
                        this.loadLists(topic.lists);
                    }
                };
            } else { // First time loading, so nothing to hide.
                this.fade_cb = function (event: AnimationEvent) {
                    this.loadLists(topic.lists);
                };
            }

            this.fade_state = 'out';
        });
    }

    onAnimationEvent(event: AnimationEvent) {
        if (this.fade_cb) {
            this.fade_cb(event);
        }
    }

    /**
     * Listen to Twitter loaded event and save loaded timelines (widgets).
     */
    private listenToSaveLoadedTopic(): void {
        twttr.events.bind(
            'loaded',
            (event) => {
                const widgets = event.widgets;
                widgets.forEach((widget: HTMLIFrameElement) => {
                    this.timelines[this.topic.name].push(widget);
                });

                if (widgets.length) {
                    this.fade_cb = function (event: AnimationEvent) {
                        this.hideLoader();
                    };
                    Promise.resolve(null).then(() => {
                        this.fade_state = 'in';
                        // Tell Angular since this is outside it's scope.
                        this.change_detector.detectChanges();
                    });
                }
            }
        );
    }

    /**
     * Show Foundation's reveal overlay.
     */
    private showLoader(): void {
        $('#loader').foundation('open');
    }

    /**
     * Hide Foundation's reveal overlay.
     */
    private hideLoader(): void {
        $('#loader').foundation('close');
    }

    /**
     * Return currently displayed timelines.
     * Meaning that some were loaded before.
     * @returns An array of timelines that are currently displayed.
     */
    private getCurrentTimelines(): HTMLIFrameElement[] {
        if (this.topic) {
            const timelines = this.timelines[this.topic.name]
            if (timelines) {
                return timelines;
            }
        }

        return [];
    }

    /**
     * Return saved timelines of given topic name.
     * @param topic_name Name of topic to retrieve timelines for.
     * @returns An array of timelines that were saved.
     */
    private getSavedTopicTimelines(topic_name: string): HTMLIFrameElement[] {
        const timelines = this.timelines[topic_name];
        if (timelines) {
            return timelines;
        }

        return this.timelines[topic_name] = [];
    }

    /**
     * Hide given timelines.
     * @param timelines Array of HTMLIFrameElements to hide.
     */
    private hideTimelines(timelines: HTMLIFrameElement[]): void {
        timelines.forEach((el) => {
            this.renderer.setStyle(el, 'display', 'none');
        });
    }

    /**
     * Show given timelines.
     * @param timelines Array of HTMLIFrameElements to show.
     */
    private showTimelines(timelines: HTMLIFrameElement[]): void {
        timelines.forEach((el) => {
            this.renderer.setStyle(el, 'display', 'inline-block');
        });
    }

    /**
     * Assign given lists triggering an Angular for directive.
     * @param lists Lists to load using Twitter's widget library.
     */
    private loadLists(lists: List[]): void {
        this.lists = lists;
        setImmediate(() => {
            console.log('twttr.widgets.load();');
            twttr.widgets.load();
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
