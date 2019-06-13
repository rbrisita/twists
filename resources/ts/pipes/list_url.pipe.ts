import { Pipe, PipeTransform } from '@angular/core';

import { List } from '../models/list';

@Pipe({
    name: 'listUrl'
})
export class ListUrlPipe implements PipeTransform {
    transform(value: List): string {
        return this.generateUrlFromList(value);
    }

    /**
     * Generate Twitter URL from given list.
     * @param list List to generate URL from.
     * @returns Generated URL in Twitter format.
     */
    private generateUrlFromList(list: List): string {
        // Convert special characters to dashes.
        const special_chars = /[\s\W]+/g;
        let screen_name: string = list.owner_screen_name.replace(special_chars, '-');
        let list_name: string = list.name.replace(special_chars, '-').toLowerCase();

        const list_url: string = `https://twitter.com/${screen_name}/lists/${list_name}`;

        return list_url + ((list.append) ? list.append : '');
    }
}
