import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';

import { AnalyticsService } from '../services/analytics.service';
import { Topic } from '../models/topic';
import { TwistService } from '../services/twist.service';

/**
 * Display topics so user can choose favorites.
 */
@Component({
    selector: 'app-favorites',
    templateUrl: './views/favorites.component.html'
})
export class FavoritesComponent implements OnDestroy, OnInit {
    /**
     * Exposed to component HTML template to be parsed into a selectable menu.
     */
    topics: Topic[];

    /**
     * Currently chosen topics to view.
     */
    private favorites: Topic[];

    private subscription_topics: Subscription;
    private subscription_favorites: Subscription;

    constructor(
        private analytics_service: AnalyticsService,
        private twist_service: TwistService
    ) {
        this.topics = [];
        this.favorites = [];
        this.subscription_topics = EMPTY.subscribe();
        this.subscription_favorites = EMPTY.subscribe();
    }

    ngOnInit(): void {
        this.subscription_topics = this.twist_service.getAllTopics().subscribe(topics => {
            this.topics = topics;
            // TODO: Should Parse topics to show for user choices.
        });

        this.subscription_favorites = this.twist_service.getFavoriteTopics().subscribe(favorites => {
            this.favorites = favorites;
            // TODO: Should Parse favorites in HTML template to add card--selected class.

            this.removeAllSelectedCards();

            this.selectTopics(this.favorites);
        });

        $('#favorites').on('open.zf.reveal', this.handleOpen.bind(this));
        $('#favorites').on('closed.zf.reveal', this.handleClose.bind(this));
    }

    ngOnDestroy(): void {
        $('#favorites').off('open.zf.reveal', this.handleOpen.bind(this));
        $('#favorites').off('closed.zf.reveal', this.handleClose.bind(this));
        this.subscription_topics.unsubscribe();
        this.subscription_favorites.unsubscribe();
    }

    /**
     * Handle selection of topic card.
     * Exposed to HTML template.
     * @param event Click/Tap event exposing target to work on.
     */
    onSelect(event: Event) {
        event.preventDefault();
        const elem: Element | null = event.target as Element;
        const card: Element | null = elem.closest('.card');

        if (!card) {
            return;
        }

        this.toggleCard(card);
    }

    /**
     * Remove selected class for cards.
     */
    private removeAllSelectedCards(): void {
        const elems = document.querySelectorAll('#favorites .card');
        // Using 'Array.prototype.forEach.call' to resolve TypeError: elems.forEach is not a function
        // On old Safari and IE browsers.
        Array.prototype.forEach.call(elems, (elem: any) => {
            elem.classList.remove('card--selected');
        });
    }

    /**
     * Add selected class to given topics.
     */
    private selectTopics(topics: Topic[]): void {
        topics.forEach((elem) => {
            const card: Element | null = document.querySelector(`[data-id="${elem.id}"]`);
            if (card) {
                this.selectCard(card);
            }
        });
    }

    private handleOpen(): void {
        this.analytics_service.viewFavorites();
    }

    /**
     * Handle close event from Foundation's Reveal. Collect all ids from selected topics
     * and update twist service.
     */
    private handleClose(): void {
        const elems = document.querySelectorAll('#favorites .card--selected');
        const new_ids: Set<number> = new Set();
        // Using 'Array.prototype.forEach.call' to resolve TypeError: elems.forEach is not a function
        // On old Safari and IE browsers.
        Array.prototype.forEach.call(elems, (elem: any) => {
            const data_id: string | null = elem.getAttribute('data-id');
            if (data_id) {
                new_ids.add(parseInt(data_id));
            }
        });

        this.twist_service.setFavoriteTopicsByIds(Array.from(new_ids));
    }

    /**
     * Add selected class to given element.
     * @param card Element to add selected class to.
     */
    private selectCard(card: Element): void {
        card.classList.add('card--selected');
    }

    /**
     * Toggle selected class to given element.
     * @param card Element to remove selected class to.
     */
    private toggleCard(card: Element): boolean {
        const added: boolean = card.classList.toggle('card--selected');

        const el: HTMLElement | null = card.querySelector('p');
        if (!el) {
            return added;
        }

        if (added) {
            this.analytics_service.addFavoriteTopic(el.innerText);
        } else {
            this.analytics_service.removeFavoriteTopic(el.innerText);
        }

        return added;
    }
}
