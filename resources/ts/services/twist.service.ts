import { Injectable } from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';
import {
    Observable,
    of,
    ReplaySubject,
    Subject
} from 'rxjs';

import { Topic } from '../models/topic';
import { TOPICS } from '../data/topics';

@Injectable({
    providedIn: 'root',
})
export class TwistService {
    private favorites: Topic[];
    private subject_favorites: ReplaySubject<Topic[]>;
    private subject_selected_topic: Subject<Topic>;

    constructor(private local_storage: LocalStorage) {
        this.favorites = [];
        this.subject_favorites = new ReplaySubject<Topic[]>(1);
        this.subject_selected_topic = new Subject<Topic>();

        this.updateFavorites();
    }

    getAllTopics(): Observable<Topic[]> {
        // TODO: HTTP service GET request
        return of(TOPICS);
    }

    /**
     * Return selected topic as an observable.
     */
    getSelectedTopic(): Observable<Topic> {
        return this.subject_selected_topic.asObservable();
    }

    /**
     * Find topic by id and dispatch that it should be loaded.
     */
    loadTopicById(id: number): void {
        const topic: Topic | undefined = this.favorites.find((elem) => {
            return elem.id === id;
        });

        this.subject_selected_topic.next(topic);
    }

    /**
     * Return favorite topics saved by user.
     */
    getFavoriteTopics(): Observable<Topic[]> {
        return this.subject_favorites.asObservable();
    }

    /**
     * Save chosen topic by given id.
     * @param id Id of topic to add.
     */
    addFavoriteTopicById(id: number): void {
        this.local_storage.setItem(TOPICS[id].name, TOPICS[id]).subscribe(() => {
            this.updateFavorites();
        }, () => {
            console.log('setItem Error');
        });
    }

    /**
     * Remove chosen topic by id.
     * @param id Id of topic to remove.
     */
    removeFavoriteTopicById(id: number): void {
        this.local_storage.removeItem(TOPICS[id].name).subscribe(() => {
            this.updateFavorites();
        }, () => {
            console.log('removeItem Error');
        });
    }

    /**
     * Rebuild favorites array.
     */
    private updateFavorites(): void {
        this.local_storage.keys().subscribe((keys: string[]) => {
            const total: number = keys.length;

            this.favorites = [];

            if (!total) {
                this.subject_favorites.next(this.favorites);
            }

            keys.forEach((value: string, index: number) => {
                this.local_storage.getItem(value).subscribe((topic) => {
                    this.favorites.push(topic as Topic);

                    if (total === (index + 1)) {
                        this.subject_favorites.next(this.favorites);
                    }
                });
            });
        });
    }
}
