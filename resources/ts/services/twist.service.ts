import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LocalStorage } from '@ngx-pwa/local-storage';
import {
    Observable,
    ReplaySubject,
    Subject,
    throwError
} from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { List } from '../models/list';
import { Topic } from '../models/topic';

@Injectable({
    providedIn: 'root',
})
export class TwistService {
    readonly seen_intro_key: string = 'seen_intro';
    private topics: Topic[];
    private favorites: Topic[];
    private subject_topics: Subject<Topic[]>;
    private subject_favorites: ReplaySubject<Topic[]>;
    private subject_selected_topic: Subject<Topic>;
    private subject_selected_list: Subject<List>;

    constructor(private local_storage: LocalStorage, private http: HttpClient) {
        this.topics = [];
        this.favorites = [];
        this.subject_topics = new Subject<Topic[]>();
        this.subject_favorites = new ReplaySubject<Topic[]>(1);
        this.subject_selected_topic = new Subject<Topic>();
        this.subject_selected_list = new Subject<List>();

        this.updateFavorites();
    }

    /**
     * Return selected list as an observable.
     */
    getSelectedList(): Observable<List> {
        return this.subject_selected_list.asObservable();
    }

    /**
     * Set selected list by given list.
     * @param list List that was selected.
     */
    setSelectedList(list: List): void {
        this.subject_selected_list.next(list);
    }

    /**
     * Request all topics from HTTP service.
     */
    getAllTopics(): Observable<Topic[]> {
        if (!this.topics.length) {
            this.http.get<Topic[]>('api/topics')
                .pipe(
                    retry(3),
                    catchError(this.handleError),
                    map(response => response['data'])
                ).subscribe((topics: Topic[]) => {
                    this.topics = topics;
                    this.subject_topics.next(this.topics);
                });
        }

        return this.subject_topics.asObservable();
    }

    /**
     * Return selected topic as an observable.
     */
    getSelectedTopic(): Observable<Topic> {
        return this.subject_selected_topic.asObservable();
    }

    /**
     * Dispatch 'undefined' as no topic is requested.
     */
    noTopicSelected(): void {
        this.subject_selected_topic.next();
    }

    /**
     * Request topic by id and dispatch that it should be loaded.
     * @param id Id of topic to load.
     */
    loadTopicById(id: number): void {
        this.http.get<Topic>('api/topics/' + id)
            .pipe(
                retry(3),
                catchError(this.handleError),
                map(response => response['data'])
            ).subscribe((topic: Topic) => {
                this.subject_selected_topic.next(topic);
            });
    }

    /**
     * Return favorite topics saved by user.
     */
    getFavoriteTopics(): Observable<Topic[]> {
        return this.subject_favorites.asObservable();
    }

    /**
     * Set favorite topics by given ids.
     * @param ids Ids of selected topics.
     */
    setFavoriteTopicsByIds(ids: number[]): void {
        // Has the intro been seen?
        this.local_storage.getItem(this.seen_intro_key).subscribe((seen) => {
            // Clear out all favorites and add new given ids.
            this.local_storage.clear().subscribe({
                next: () => {
                    if (!ids.length) {
                        this.updateFavorites();
                        return;
                    }

                    ids.forEach((id, index) => {
                        this.local_storage.setItem(this.topics[id].name, this.topics[id]).subscribe(() => {
                            if (index === (ids.length - 1)) {
                                this.updateFavorites();
                            }
                        }, () => {
                            console.error('setItem Error on id=' + id + ', index=' + index);
                        });
                    });
                },
                complete: () => {
                    this.seenIntro(seen as boolean);
                }
            });
        });
    }

    /**
     * Rebuild favorites array.
     */
    private updateFavorites(): void {
        this.local_storage.keys().subscribe((keys: string[]) => {
            // Remove seen intro data if found.
            const index: number = keys.indexOf(this.seen_intro_key);
            if (index > -1) {
                keys.splice(index, 1);
            }

            const total: number = keys.length;

            this.favorites = [];

            if (!total) {
                this.subject_favorites.next(this.favorites);
                return;
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

    /**
     * Set intro modal key to given value.
     * @param seen Whether the intro modal has been seen and closed by the user.
     */
    seenIntro(seen: boolean): void {
        console.log('Setting seen intro.');
        this.local_storage.setItem(this.seen_intro_key, seen).subscribe(() => { });
    }

    /**
     * Return observable of seen intro key value.
     */
    hasSeenIntro(): Observable<unknown> {
        return this.local_storage.getItem(this.seen_intro_key);
    }

    /**
     * Handle HTTP errors.
     * @param error Error from HTTP request.
     */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.log('error.type', error.type);
            console.log('error.name', error.name);
            console.log('error.status', error.status);
            console.log('error.statusText', error.statusText);
            console.log('error.message', error.message);
        }

        console.log('error', error);
        console.log('error.error', error.error);

        // Return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    };
}
