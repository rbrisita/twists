import {
    ChangeDetectorRef,
    Component,
    ElementRef,
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
import { clearInterval, setInterval } from 'timers';
import '../../../node_modules/foundation-sites/dist/js/foundation';

import { AnalyticsService } from '../services/analytics.service';
import { List } from '../models/list';
import { ListUrlPipe } from '../pipes/list_url.pipe';
import { ListWidgetIdPipe } from '../pipes/list_widget-id.pipe';
import { Topic } from '../models/topic'
import { TwistService } from '../services/twist.service';

/**
 * The Twists Component is a collection of lists from a loaded topic.
 * Responsible for fading in and out loaded timelines.
 *
 * Terminolgoy:
 * A timeline denotes a HTMLElement.
 * List data eventually becomes a timeline.
 * A widget id is an iframe container that contains timelines;
 * it is in Twitter given format: list:{screen_name}:{list_name}
 * A refresh id format is: list♥{screen-name}♥{list-name}
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
        ListUrlPipe,
        ListWidgetIdPipe
    ]
})
export class TwistsComponent implements OnDestroy, OnInit {
    /**
     * Regular expression to find all colons.
     * Exposed to HTML template.
     */
    re: RegExp = /:/g;

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
    private loaded_timelines: { [key: string]: HTMLElement[] };

    /**
     * A dictionary of timeline elements that are refreshing.
     */
    private refreshing_timelines: { [key: string]: HTMLElement[] };

    /**
     * A dictionary of requested timelines to track as they load.
     */
    private requested_timelines: { [key: string]: string[] };
    private subscription_selected_topic: Subscription;
    private interval_id: NodeJS.Timeout | null;

    /**
     * The current list that is in the viewport.
     */
    private list_in_view: List;

    /**
     * Template HTML string to create a refresh container and button.
     * Contains SVG path due to Chrome v73.0.3683.103 bug.
     */
    readonly refresh_template: string = `
    <div id="{WIDGET_ID}" class="text-center">
        <button class="button shadow tiny refresh-btn">
            <svg class="icon--medium refresh" viewBox="0 0 32 32">
                <path d="M14.312 30.312c3.457 0 6.8-1.26 9.416-3.551 0.334-0.291 0.367-0.799 0.076-1.135l-3.331-3.809c-0.14-0.161-0.339-0.259-0.552-0.273-0.212-0.015-0.423 0.056-0.584 0.198-1.395 1.222-3.179 1.896-5.025 1.896-4.213 0-7.64-3.427-7.64-7.638s3.427-7.638 7.64-7.638c3.939 0 7.191 2.999 7.594 6.833h-2.53c-0.315 0-0.602 0.185-0.733 0.472s-0.080 0.625 0.127 0.863l5.91 6.754c0.306 0.35 0.906 0.349 1.212 0l5.91-6.754c0.208-0.238 0.257-0.575 0.127-0.863s-0.417-0.472-0.733-0.472h-2.593c-0.418-7.519-6.668-13.507-14.291-13.507-7.89-0-14.311 6.42-14.311 14.312s6.421 14.312 14.312 14.312zM14.312 3.296c7.005 0 12.704 5.699 12.704 12.704 0 0.444 0.36 0.805 0.804 0.805h1.602l-4.137 4.728-4.137-4.728h1.604c0.444 0 0.805-0.361 0.805-0.805 0-5.099-4.148-9.246-9.246-9.246-5.099 0-9.248 4.147-9.248 9.246s4.148 9.246 9.248 9.246c1.967 0 3.876-0.63 5.457-1.79l2.278 2.605c-2.219 1.709-4.937 2.642-7.735 2.642-7.004 0-12.702-5.699-12.702-12.703s5.698-12.704 12.702-12.704z"/>
            </svg>
        </button>
    </div>`;

    constructor(
        private analytics_service: AnalyticsService,
        private change_detector: ChangeDetectorRef,
        private elem_ref: ElementRef,
        private list_url_pipe: ListUrlPipe,
        private list_widget_id_pipe: ListWidgetIdPipe,
        private renderer: Renderer2,
        private twist_service: TwistService
    ) {
        this.topic = {
            id: -1,
            name: '',
            lists: []
        };
        this.list_in_view = {
            owner_screen_name: '',
            name: ''
        };
        this.lists = [];
        this.first_lists = [];
        this.fade_state = null;
        this.fade_cb = () => { };
        this.subsequent_lists = [];
        this.loaded_timelines = {};
        this.refreshing_timelines = {};
        this.requested_timelines = {};
        this.subscription_selected_topic = EMPTY.subscribe();
        this.interval_id = null;
    }

    /**
     * Listen to loaded timelines and when a user selects a specific topic.
     */
    ngOnInit(): void {
        this.listenToSaveLoadedTopic();
        this.listenToScroll();

        this.subscription_selected_topic = this.twist_service.getSelectedTopic().subscribe(topic => {
            this.showLoader();

            const current_timelines: HTMLElement[] = this.getCurrentTimelines();
            const saved_timelines: HTMLElement[] = this.getSavedTimelinesFromTopic(topic);

            this.topic = topic;
            if (topic) {
                this.requested_timelines[topic.name] = this.getWidgetIdsFromTopic(topic);
            }

            // Currently showing timelines, start fading out, and hide them when done.
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
                    } else { // No saved timelines, so load new lists.
                        this.loadListsFromTopic(topic);
                    }
                };
            } else { // First time loading, so nothing to hide.
                this.fade_cb = function () {
                    this.loadListsFromTopic(topic);
                };
            }

            this.fade_state = 'out';
            this.forceUpdate();
        });

        this.analytics_service.viewMain();
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
        twttr.ready((twitter: Twitter) => {
            twitter.events.bind('loaded', (event) => {
                const widgets = event.widgets;
                if (widgets.length) {
                    this.saveTimelines(widgets);
                    this.presentTimelines();
                }

                if (this.subsequent_lists.length) {
                    // On small devices the requests sometimes overwhelms the mobile browser.
                    if (Foundation.MediaQuery.current === 'small') {
                        this.lists = this.subsequent_lists.splice(0, 1);
                    } else {
                        this.lists = this.subsequent_lists;
                        this.subsequent_lists = [];
                    }
                    this.twitterLoad();
                }
            });
        });
    }

    /**
     * Listen to window scroll and update selected list when said list is in view.
     */
    private listenToScroll() {
        let handleScroll: boolean;
        window.onscroll = () => {
            handleScroll = true;
        }

        this.interval_id = setInterval(() => {
            if (handleScroll) {
                handleScroll = false;
                this.handleListInView();
            }
        }, 100);
    }

    /**
     * Set which list is being viewed in the viewport.
     */
    private handleListInView(): void {
        const current_timelines: HTMLElement[] = this.getCurrentTimelines();
        const widget_ids: string[] = this.getWidgetIdsFromTopic(this.topic);
        const viewport_bottom: number = window.pageYOffset + window.innerHeight;
        const viewport_top: number = window.pageYOffset;
        let found_index: number = -1;
        let found_list: List;

        // Find which timeline is in view
        if (current_timelines.length === 1) {
            found_list = this.topic.lists[0];
        } else {
            current_timelines.forEach((el: HTMLElement) => {
                if (viewport_bottom > el.offsetTop && viewport_top < (el.offsetTop + el.scrollHeight)) {
                    const widget_id: string = this.getWidgetIdFromElement(el);
                    // Only allow the greater index to be selected.
                    const index = widget_ids.indexOf(widget_id);
                    if (index > found_index) {
                        found_index = index;
                    }
                }
            });
            found_list = this.topic.lists[found_index];
        }

        // Only update if new.
        if (found_list !== this.list_in_view) {
            this.list_in_view = found_list;
            this.twist_service.setSelectedList(this.list_in_view);
        }
    };

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

        const hide_widgets: HTMLElement[] = new Array<HTMLElement>();
        const dom_parser: DOMParser = new DOMParser();

        // For each loaded widget find its widget id.
        widgets.forEach((widget: HTMLIFrameElement) => {
            // Find what topic contains this widget id and save it.
            const widget_id: string = this.getWidgetIdFromElement(widget);
            for (const topic_name in this.requested_timelines) {
                const index: number = this.requested_timelines[topic_name].indexOf(widget_id);
                if (index === -1) {
                    continue;
                }

                // Delete loaded widget id and delete topic_name if no longer needed.
                this.requested_timelines[topic_name].splice(index, 1);
                if (!this.requested_timelines[topic_name].length) {
                    delete this.requested_timelines[topic_name];
                }

                // Is this possibily a refreshed timeline?
                let new_timeline: boolean = true;
                rt_label: for (const topic_name in this.refreshing_timelines) {
                    // Does refreshed timeline have an array?
                    const elems: HTMLElement[] = this.refreshing_timelines[topic_name];
                    const loaded_timelines: HTMLElement[] = this.loaded_timelines[topic_name];
                    // For each stored element check to see if it is in the loaded_timelines
                    for (const el of elems) {
                        const index: number = loaded_timelines.indexOf(el);
                        if (index === -1) {
                            continue;
                        }

                        // Is current widget the same?
                        if (loaded_timelines[index].getAttribute('data-widget-id') === widget_id) {
                            const button: Element = this.getRefreshButtonFromWidgetId(widget_id);
                            if (button) {
                                button.classList.remove('rounded');
                            }

                            elems.splice(elems.indexOf(el), 1);
                            loaded_timelines[index].remove();
                            loaded_timelines[index] = widget;
                            new_timeline = false;
                            break rt_label;
                        }
                    }

                    if (!elems.length) {
                        delete this.refreshing_timelines[topic_name];
                    }
                }

                if (new_timeline) {
                    const parent_div: HTMLElement | null = widget.parentElement;
                    if (!parent_div) {
                        return;
                    }

                    // Create refresh button
                    const refresh: string = this.refresh_template.replace('{WIDGET_ID}', this.getRefreshIdFromWidgetId(widget_id));
                    const html: Document = dom_parser.parseFromString(refresh, 'text/html');
                    if (html.body.firstChild) {
                        this.renderer.insertBefore(parent_div, html.body.firstChild, widget);
                    }

                    // Found it and save it.
                    this.loaded_timelines[topic_name].push(widget);
                }

                // Not current topic? Hide it.
                if (this.topic.name !== topic_name) {
                    hide_widgets.push(widget);
                }

                break;
            }
        });

        this.hideTimelines(hide_widgets);
    }

    /**
     * Handle refresh request for associated timeline.
     * @param event Click event on div housing refresh button.
     */
    onRefresh(event: MouseEvent) {
        // Filter out any non-button clicks.
        const el: Element = event.target as Element;
        const button: Element | null = el.closest('button');
        if (!button) {
            return;
        }

        const div: Element | null = button.closest('div');
        if (!div) {
            return;
        }

        const refresh_id: string | null = this.getRefreshIdFromElement(div);
        const widget_id: string = this.getWidgetIdFromRefreshId(refresh_id);
        const timeline_to_refesh: HTMLElement = this.getTimelineFromWidgetId(widget_id);
        if (!timeline_to_refesh) {
            return;
        }

        // Refresh timeline.
        button.classList.add('rounded');

        const list: List = this.getListFromRefreshId(refresh_id);
        const new_list: string = `
        <a
        class="twitter-timeline"
        data-tweet-limit=20
        data-show-replies=true
        href="${this.list_url_pipe.transform(list)}">
            Refreshing ${list.name} list by ${list.owner_screen_name}...
        </a>`;
        const dom_parser: DOMParser = new DOMParser();
        const html: Document = dom_parser.parseFromString(new_list, 'text/html');
        if (!html.body.firstChild) {
            return;
        }

        this.widgetIdToRequest(widget_id);
        this.timelineToRefresh(timeline_to_refesh);
        this.insertHTMLElementBefore(html.body.firstChild, timeline_to_refesh);
        this.twitterLoad();

        this.analytics_service.refreshTopicList(this.topic, list);
    }

    /**
     * Store given widget id of requested timeline.
     * @param widget_id Id of widget of requested timeline.
     */
    private widgetIdToRequest(widget_id: string): void {
        if (!this.requested_timelines[this.topic.name]) {
            this.requested_timelines[this.topic.name] = [];
        }
        this.requested_timelines[this.topic.name].push(widget_id);
    }

    /**
     * Store given timeline that will refresh in the future.
     * @param el The stale timeline that will be replaced in the future.
     */
    private timelineToRefresh(el: HTMLElement): void {
        if (!this.refreshing_timelines[this.topic.name]) {
            this.refreshing_timelines[this.topic.name] = [];
        }
        this.refreshing_timelines[this.topic.name].push(el);
    }

    /**
     * Insert given new element before given existing element.
     * @param new_node New node to insert.
     * @param existing_el Existing element to follow new node.
     */
    private insertHTMLElementBefore(new_node: Node, existing_el: HTMLElement) {
        const twists: Element | null = this.getTwistsElement();
        if (!twists) {
            return;
        }
        this.renderer.insertBefore(twists, new_node, existing_el);
    }

    /**
     * Get twists element that houses timelines.
     */
    private getTwistsElement(): Element | null {
        return this.elem_ref.nativeElement.querySelector('#twists');
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
    private getCurrentTimelines(): HTMLElement[] {
        if (this.topic) {
            const timelines = this.loaded_timelines[this.topic.name]
            if (timelines) {
                return timelines;
            }
        }

        return [];
    }

    /**
     * Return saved timelines of given topic.
     * @param topic Topic to retrieve timelines for.
     * @returns An array of timelines that were saved.
     */
    private getSavedTimelinesFromTopic(topic: Topic): HTMLElement[] {
        if (!topic) {
            return [];
        }

        const topic_name: string = topic.name;
        const timelines = this.loaded_timelines[topic_name];
        if (timelines) {
            return timelines;
        }

        return this.loaded_timelines[topic_name] = [];
    }

    /**
     * Hide given timelines.
     * @param timelines Array of HTMLElements to hide.
     */
    private hideTimelines(timelines: HTMLElement[]): void {
        timelines.forEach((el) => {
            const button: Element = this.getRefreshButtonFromWidgetId(this.getWidgetIdFromElement(el));
            if (button) {
                button.classList.add('hide');
            }
            this.renderer.setStyle(el, 'display', 'none');
        });
    }

    /**
     * Show given timelines.
     * @param timelines Array of HTMLElements to show.
     */
    private showTimelines(timelines: HTMLElement[]): void {
        timelines.forEach((el) => {
            const button: Element = this.getRefreshButtonFromWidgetId(this.getWidgetIdFromElement(el));
            if (button) {
                button.classList.remove('hide');
            }
            this.renderer.setStyle(el, 'display', 'inline-block');
        });
    }

    /**
     * Return timeline associated with given widget id.
     * @param widget_id Id of widget of timeline to get.
     */
    private getTimelineFromWidgetId(widget_id: string): HTMLElement {
        return this.elem_ref.nativeElement.querySelector('[data-widget-id="' + widget_id + '"]');
    }

    /**
     * Return a List object from the given refresh id.
     * @param refresh_id Id of refresh container to create List from.
     */
    private getListFromRefreshId(refresh_id: string): List {
        let [, owner_screen_name, name] = refresh_id.split('♥');
        name = name.replace(/_/g, '-');
        return { owner_screen_name, name };
    }

    /**
     * Return button associated with given widget id.
     * @param widget_id Id of widget of associated button to get.
     */
    private getRefreshButtonFromWidgetId(widget_id: string): Element {
        return this.elem_ref.nativeElement.querySelector('#' + this.getRefreshIdFromWidgetId(widget_id) + ' button');
    }

    /**
     * Return refresh id of given element.
     * @param el Element that contains an id in refresh id format.
     */
    private getRefreshIdFromElement(el: Element): string {
        let id: string | null = el.getAttribute('id');
        if (!id) {
            id = '';
        }
        return id;
    }

    /**
     * Return refresh id from given widget id.
     * @param widget_id Id of widget to convert to a refresh id.
     */
    private getRefreshIdFromWidgetId(widget_id: string): string {
        return widget_id.replace(/:/g, '♥');
    }

    /**
     * Return widget id of given element.
     * @param el Element that contains an id in widget id format.
     */
    private getWidgetIdFromElement(el: Element): string {
        let id: string | null = el.getAttribute('data-widget-id');
        if (!id) {
            id = '';
        }
        return id;
    }

    /**
     * Return widget id from given refresh id.
     * @param refresh_id Id of refresh container to convert to a widget id.
     */
    private getWidgetIdFromRefreshId(refresh_id: string): string {
        return refresh_id.replace(/♥/g, ':');
    }

    /**
     * With the given topic assign lists triggering an Angular 'for' directive.
     * @param topic Topic containing lists to load using Twitter's widget library.
     */
    private loadListsFromTopic(topic: Topic): void {
        if (!topic || !topic.lists.length) {
            this.presentTimelines();
            return;
        }

        const lists: List[] = topic.lists;

        // On small devices the requests sometimes overwhelms the mobile browser.
        if (Foundation.MediaQuery.current === 'small') {
            this.subsequent_lists = lists.slice(1).reverse();
        } else {
            this.subsequent_lists = lists.slice(1);
        }

        this.list_in_view = lists[0];
        this.first_lists = [this.list_in_view];
        this.twist_service.setSelectedList(this.list_in_view);
        this.twitterLoad();
    }

    private twitterLoad(): void {
        setTimeout(() => {
            twttr.ready((twitter: Twitter) => {
                console.log('twitter.widgets.load');
                // 'twttr.widgets.load' is a overload method.
                // @ts-ignore
                twitter.widgets.load(this.getTwistsElement());
            });
        }, 100);
    }

    ngOnDestroy(): void {
        this.subscription_selected_topic.unsubscribe();
        if (this.interval_id) {
            clearInterval(this.interval_id);
        }
        window.onscroll = null;
        twttr.ready((twitter: Twitter) => {
            twitter.events.bind('loaded', () => { });
        });
    }
}
