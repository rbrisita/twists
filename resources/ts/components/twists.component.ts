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

import { EMPTY, Subscription } from 'rxjs';

import { List } from '../models/list';
import { Topic } from '../models/topic'
import { TwistService } from '../services/twist.service';

/**
 * The Twists Component is a collection of loaded topics which contain lists.
 * Responsible for fading in and out loaded timelines.
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
    /**
     * Chosen topic to display.
     */
    topic: Topic;

    /**
     * Exposed to HTML template to display lists of chosen topic.
     */
    lists: List[];

    /**
     * Animation fade state of component.
     */
    fade_state: string | null;

    /**
     * Face callback when animation is done.
     */
    fade_cb: (event: AnimationEvent) => void;

    /**
     * A dictionary of loaded timeline elements to turn on and off.
     */
    private timelines: { [key: string]: HTMLIFrameElement[] };
    private subscription_selected_topic: Subscription;

    constructor(
        private renderer: Renderer2,
        private change_detector: ChangeDetectorRef,
        private twist_service: TwistService
    ) {
        this.topic = {
            id: -1,
            name: '',
            lists: []
        };
        this.lists = [];
        this.fade_state = null;
        this.fade_cb = () => { };
        this.timelines = {};
        this.subscription_selected_topic = EMPTY.subscribe();
    }

    /**
     * Listen to loaded timelines and when a user selects a specific topic.
     */
    ngOnInit(): void {
        this.listenToSaveLoadedTopic();

        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe(topic => {
            const current_timelines: HTMLIFrameElement[] = this.getCurrentTimelines();
            const saved_timelines: HTMLIFrameElement[] = this.getSavedTopicTimelines(topic.name);

            this.topic = topic;

            this.showLoader();

            // Currently showing timelines, start fading out, and hide them when done
            if (current_timelines.length) {
                this.fade_cb = function () {
                    // Currently faded out now, hide old timelines, show saved timelines, and fade back in.
                    this.hideTimelines(current_timelines);

                    if (saved_timelines.length) {
                        this.showTimelines(saved_timelines);

                        this.fade_cb = function () {
                            this.hideLoader();
                        };
                        this.fade_state = 'in';
                    } else { // No saved timelines, so load new lists
                        this.loadLists(topic.lists);
                    }
                };
            } else { // First time loading, so nothing to hide.
                this.fade_cb = function () {
                    this.loadLists(topic.lists);
                };
            }

            this.fade_state = 'out';

            // Tell Angular since this is outside it's scope.
            this.change_detector.detectChanges();
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
                this.saveTimelines(widgets);

                if (widgets.length) {
                    this.presentTimelines()
                }
            }
        );
    }

    /**
     * Save loaded timelines for reuse.
     * @param widgets An array of widgets that have loaded.
     */
    private saveTimelines(widgets: any[]): void {
        widgets.forEach((widget: HTMLIFrameElement) => {
            this.timelines[this.topic.name].push(widget);
        });
    }

    /**
     * Present timelines to user.
     */
    private presentTimelines(): void {
        this.fade_cb = function () {
            this.hideLoader();
        };
        Promise.resolve(null).then(() => {
            this.fade_state = 'in';
            // Tell Angular since this is outside it's scope.
            this.change_detector.detectChanges();
        });
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
     * @returns An array of timelines that are currently displayed and loaded before.
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
     * Assign given lists triggering an Angular 'for' directive.
     * @param lists Lists to load using Twitter's widget library.
     */
    private loadLists(lists: List[]): void {
        this.lists = lists;
        if (this.lists.length) {
            setImmediate(() => {
                console.log('twttr.widgets.load();');
                twttr.widgets.load();
            });
        } else {
            this.presentTimelines();
        }
    }

    ngOnDestroy(): void {
        this.subscription_selected_topic.unsubscribe();
    }
}
