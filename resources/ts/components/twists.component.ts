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
import { ListWidgetIdPipe } from '../pipes/list_widget-id.pipe';
import { Topic } from '../models/topic'
import { TwistService } from '../services/twist.service';

/**
 * The Twists Component is a collection of lists from a loaded topic.
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
    ],
    providers: [
        ListWidgetIdPipe
    ]
})
export class TwistsComponent implements OnDestroy, OnInit {
    /**
     * Chosen topic to display.
     * Exposed to HTML template.
     */
    topic: Topic;

    /**
     * Display lists of chosen topic.
     * Exposed to HTML template.
     */
    lists: List[];

    /**
     * Display the first lists.
     * Exposed to HTML template.
     */
    first_lists: List[];

    /**
     * Animation fade state of component.
     * Exposed to HTML template.
     */
    fade_state: string | null;

    /**
     * Face callback when animation is done.
     */
    private fade_cb: (event: AnimationEvent) => void;

    /**
     * Lists to load after the first lists.
     */
    private subsequent_lists: List[];

    /**
     * A dictionary of loaded timeline elements to turn on and off.
     */
    private loaded_timelines: { [key: string]: HTMLIFrameElement[] };

    /**
     * A dictionary of requested timelines to track as they load.
     */
    private requested_timelines: { [key: string]: string[] };
    private subscription_selected_topic: Subscription;

    constructor(
        private renderer: Renderer2,
        private change_detector: ChangeDetectorRef,
        private twist_service: TwistService,
        private list_widget_id_pipe: ListWidgetIdPipe
    ) {
        this.topic = {
            id: -1,
            name: '',
            lists: []
        };
        this.lists = [];
        this.first_lists = [];
        this.fade_state = null;
        this.fade_cb = () => { };
        this.subsequent_lists = [];
        this.loaded_timelines = {};
        this.requested_timelines = {};
        this.subscription_selected_topic = EMPTY.subscribe();
    }

    /**
     * Listen to loaded timelines and when a user selects a specific topic.
     */
    ngOnInit(): void {
        this.listenToSaveLoadedTopic();

        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.showLoader();

            const current_timelines: HTMLIFrameElement[] = this.getCurrentTimelines();
            const saved_timelines: HTMLIFrameElement[] = this.getSavedTopicTimelines(topic.name);

            this.topic = topic;

            this.requested_timelines[topic.name] = this.getWidgetIdsFromTopic(topic);

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
            this.forceUpdate();
        });
    }

    onAnimationEvent(event: AnimationEvent) {
        if (this.fade_cb) {
            this.fade_cb(event);
        }
    }

    /**
     * Parse lists from given topic and create their Twitter widget ids.
     * @param topic Topic to parse lists from.
     * @returns Array of widget id strings.
     */
    private getWidgetIdsFromTopic(topic: Topic): string[] {
        const widget_ids: string[] = new Array<string>();
        topic.lists.forEach((list) => {
            const widget_id: string = this.list_widget_id_pipe.transform(list);
            widget_ids.push(widget_id);
        });
        return widget_ids;
    }

    /**
     * Tell Angular to update since this is outside it's scope.
     */
    private forceUpdate() {
        this.change_detector.detectChanges();
    }

    /**
     * Listen to Twitter loaded event and save loaded timelines (widgets).
     */
    private listenToSaveLoadedTopic(): void {
        twttr.events.bind('loaded', (event) => {
            const widgets = event.widgets;
            if (widgets.length) {
                this.saveTimelines(widgets);
                this.presentTimelines();
            }

            if (this.subsequent_lists.length) {
                this.lists = this.subsequent_lists;
                this.subsequent_lists = [];
                this.twitterLoad();
            }
        });
    }

    /**
     * Save loaded timelines for reuse.
     * @param widgets An array of widgets that have loaded.
     */
    private saveTimelines(widgets: any[]): void {
        /**
         * The order of loaded widgets is not guaranteed. It is possible to switch
         * to another topic while the previous topic's lists are still loading. Below
         * prevents adding loaded widgets to the wrong topic.
         */

        const hide_widgets: HTMLIFrameElement[] = new Array<HTMLIFrameElement>();

        // For each loaded widget find its widget id.
        widgets.forEach((widget: HTMLIFrameElement) => {
            const widget_id: string | null = widget.getAttribute('data-widget-id');
            if (!widget_id) {
                return;
            }

            // Find what topic contains this widget id and save it.
            for (const topic_name in this.requested_timelines) {
                const index: number = this.requested_timelines[topic_name].indexOf(widget_id);
                if (index === -1) {
                    continue;
                }

                // Found it and save it.
                this.loaded_timelines[topic_name].push(widget);

                // Not current topic? Hide it.
                if (this.topic.name !== topic_name) {
                    hide_widgets.push(widget);
                }

                // Delete loaded widget id and delete topic_name if no longer needed.
                this.requested_timelines[topic_name].splice(index, 1);
                if (!this.requested_timelines[topic_name].length) {
                    delete this.requested_timelines[topic_name];
                }
                break;
            }
        });

        this.hideTimelines(hide_widgets);
    }

    /**
     * Present timelines to user.
     */
    private presentTimelines(): void {
        if (this.fade_state === 'in') {
            return;
        }

        this.fade_cb = function () {
            this.hideLoader();
        };
        Promise.resolve(null).then(() => {
            this.fade_state = 'in';
            this.forceUpdate();
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
            const timelines = this.loaded_timelines[this.topic.name]
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
        const timelines = this.loaded_timelines[topic_name];
        if (timelines) {
            return timelines;
        }

        return this.loaded_timelines[topic_name] = [];
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
        this.subsequent_lists = lists.slice(1);
        if (lists.length) {
            this.first_lists = [lists[0]];
            setImmediate(() => {
                this.twitterLoad();
            });
        } else {
            this.presentTimelines();
        }
    }

    private twitterLoad(): void {
        setImmediate(() => {
            // 'twttr.widgets.load' is a overload method.
            // @ts-ignore
            twttr.widgets.load(document.getElementById('twists'));
        });
    }

    ngOnDestroy(): void {
        this.subscription_selected_topic.unsubscribe();
    }
}
