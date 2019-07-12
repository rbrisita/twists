import { Injectable } from '@angular/core';

import { List } from '../models/list';
import { Stopwatch } from '../models/stopwatch';
import { Topic } from '../models/topic';

// gtag is Google Analytics provider to set and send metrics.
declare let gtag: Function;

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    private watch_map: Map<string, Stopwatch>;

    constructor() {
        this.watch_map = new Map();

        if (typeof twttr !== 'undefined') {
            twttr.ready((twitter: Twitter) => {
                twitter.events.bind('click', $.proxy(this.twitterClickEvent, this));
                twitter.events.bind('tweet', $.proxy(this.twitterTweetIntent, this));
                twitter.events.bind('retweet', $.proxy(this.twitterRetweetIntent, this));
                twitter.events.bind('like', $.proxy(this.twitterLikeIntent, this));
                twitter.events.bind('follow', $.proxy(this.twitterFollowIntent, this));
            });
        }
    }

    startWatch(label: string): void {
        const sw: Stopwatch = {
            start: performance.now()
        }
        this.watch_map.set(label, sw);
    }

    stopWatch(label: string): void {
        const sw: Stopwatch | undefined = this.watch_map.get(label);
        if (!sw) {
            console.error('AnalyticsService: stopWatch("' + label + '") called before startWatch("' + label + '").');
            return;
        }

        sw.stop = performance.now();
    }

    timedOpertion(label: string, name: string): void {
        const sw: Stopwatch | undefined = this.watch_map.get(label);
        if (!sw) {
            console.error('AnalyticsService: no "' + label + '" label found.');
            return;
        }

        if (!sw.stop) {
            sw.stop = performance.now();
        }

        // Sends the timing event to Google Analytics.
        gtag('event', 'timing_complete', {
            name: name,
            value: Math.round(sw.stop - sw.start),
            event_category: label
        });
    }

    /**
     * Twists loaded and is showing first list.
     */
    viewMain(): void {
        gtag('event', 'screen_view', {
            screen_name: 'Main'
        });
    }

    viewIntro(): void {
        gtag(event, 'screen_view', {
            screen_name: 'Intro'
        });
    }

    viewFavorites(): void {
        gtag('event', 'screen_view', {
            screen_name: 'Favorites'
        });
    }

    viewAbout(): void {
        gtag('event', 'screen_view', {
            screen_name: 'About'
        });
    }

    viewError(): void {
        gtag(event, 'screen_view', {
            screen_name: 'Error'
        });
    }

    exception(err: string, fatal: boolean = false): void {
        gtag('event', 'exception', {
            'description': err,
            'fatal': fatal
        });
    }

    addFavoriteTopic(name: string): void {
        gtag('event', 'add', {
            event_category: 'Favorites',
            event_label: name
        });
    }

    removeFavoriteTopic(name: string): void {
        gtag('event', 'remove', {
            event_category: 'Favorites',
            event_label: name
        });
    }

    selectTopic(topic: Topic): void {
        gtag('event', 'select', {
            event_category: 'Topic',
            event_label: topic.name
        });
    }

    selectTopicList(topic: Topic, list: List): void {
        gtag('event', 'select', {
            event_category: 'Topic List',
            event_label: topic.name + ':list:' + list.owner_screen_name + ':' + list.name
        });
    }

    refreshTopicList(topic: Topic, list: List): void {
        gtag('event', 'refresh', {
            event_category: 'Topic List',
            event_label: topic.name + ':list:' + list.owner_screen_name + ':' + list.name
        });
    }

    private twitterAnalytics(action: string, target: string | undefined): void {
        gtag('event', 'social', {
            event_category: 'Twitter',
            event_action: action,
            event_label: target
        });
    }

    private twitterClickEvent(intent: TwitterIntentEvent): void {
        if (!intent) return;
        this.twitterAnalytics(intent.type, intent.region);
    }

    private twitterLikeIntent(intent: TwitterIntentEvent): void {
        if (!intent) return;
        this.twitterAnalytics(intent.type, intent.data.tweet_id);
    }

    private twitterRetweetIntent(intent: TwitterIntentEvent): void {
        if (!intent) return;
        this.twitterAnalytics(intent.type, intent.data.source_tweet_id);
    }

    private twitterTweetIntent(intent: TwitterIntentEvent): void {
        if (!intent) return;
        this.twitterAnalytics(intent.type, intent.data.tweet_id);
    }

    private twitterFollowIntent(intent: TwitterIntentEvent): void {
        if (!intent) return;
        this.twitterAnalytics(intent.type, intent.data.user_id + " (" + intent.data.screen_name + ")");
    }
}
