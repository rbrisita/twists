import { Topic } from '../models/topic';
import { CRYPTO } from './crypto';
import { SCITECH } from './scitech';

export const TOPICS: Topic[] = [
    { id: 0, name: 'Science & Tech', lists: SCITECH },
    { id: 1, name: 'Crypto', lists: CRYPTO },
];
