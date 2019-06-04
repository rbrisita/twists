import { Topic } from '../models/topic';
import { CRYPTO } from './crypto';
import { TECH } from './tech';

export const FAVORITES: Topic[] = [
    { id: 15, name: 'Tech', lists: TECH },
    { id: 2, name: 'Cryptocurrency', lists: CRYPTO },
];
