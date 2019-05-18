import { Injectable } from '@angular/core';

import {
    Observable,
    of,
    Subject
} from 'rxjs';

import { Topic } from '../models/topic';
import { TOPICS } from '../data/topics';

@Injectable({
    providedIn: 'root',
})
export class TwistService {
    private subject = new Subject<Topic>();

    constructor() { }

    getAllTopics(): Observable<Topic[]> {
        return of(TOPICS);
    }

    getSelectedTopic(): Observable<Topic> {
        return this.subject.asObservable();
    }

    loadTopic(id: number): void {
        this.subject.next(TOPICS[id]);
    }
}
