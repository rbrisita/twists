import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import { EMPTY, Subscription } from 'rxjs';

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

    constructor(private twist_service: TwistService) {
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
    }

    ngOnDestroy(): void {
        this.subscription_topics.unsubscribe();
        this.subscription_favorites.unsubscribe();
    }

    /**
     * Handle selection of topic card.
     * Exposed to HTML template.
     * @param event Click/Tap event exposing target to work on.
     */
    onSelect(event: Event) {
        const elem: Element | null = event.target as Element;
        const card: Element | null = elem.closest('.card');

        if (!card) {
            return;
        }

        const data_id: string | null = card.getAttribute('data-id');
        if (data_id) {
            const id: number = parseInt(data_id);
            if (this.removeCard(card)) {
                this.twist_service.removeFavoriteTopicById(id);
            } else {
                this.twist_service.addFavoriteTopicById(id);
            }
        }
    }

    /**
     * Remove selected class for cards.
     */
    private removeAllSelectedCards(): void {
        const elems = document.querySelectorAll('#favorites .card');
        elems.forEach((elem) => {
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

    /**
     * Add selected class to given element.
     * @param card Element to add selected class to.
     */
    private selectCard(card: Element): boolean {
        return card.classList.toggle('card--selected');
    }

    /**
     * Remove selected class to given element.
     * @param card Element to remove selected class to.
     */
    private removeCard(card: Element): boolean {
        return card.classList.contains('card--selected');
    }
}
