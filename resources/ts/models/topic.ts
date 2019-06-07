import { List } from './list';

export interface Topic {
    id: number;
    name: string;
    lists: Array<List>;
}
