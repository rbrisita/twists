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

import { Topic } from '../models/topic';

@Injectable({
    providedIn: 'root',
})
export class TwistService {
    private topics: Topic[];
    private favorites: Topic[];
    private subject_topics: Subject<Topic[]>;
    private subject_favorites: ReplaySubject<Topic[]>;
    private subject_selected_topic: Subject<Topic>;

    constructor(private local_storage: LocalStorage, private http: HttpClient) {
        this.topics = [];
        this.favorites = [];
        this.subject_topics = new Subject<Topic[]>();
        this.subject_favorites = new ReplaySubject<Topic[]>(1);
        this.subject_selected_topic = new Subject<Topic>();

        this.updateFavorites();
    }

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
     * Find topic by id and dispatch that it should be loaded.
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
     * Save chosen topic by given id.
     * @param id Id of topic to add.
     */
    addFavoriteTopicById(id: number): void {
        if (!this.topics.length) {
            console.error('Topics are empty.');
            return;
        }

        this.local_storage.setItem(this.topics[id].name, this.topics[id]).subscribe(() => {
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
        if (!this.topics.length) {
            console.error('Topics are empty.');
            return;
        }

        this.local_storage.removeItem(this.topics[id].name).subscribe(() => {
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

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            console.log(error.type);
            console.log(error.name);
            console.log(error.status);
            console.log(error.statusText);
            console.log(error.message);

        }

        console.log(error);
        console.log(error.error);

        // Return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    };
}
