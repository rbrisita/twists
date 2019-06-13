import { Pipe, PipeTransform } from '@angular/core';

import { List } from '../models/list';

@Pipe({
    name: 'listWidgetId'
})
export class ListWidgetIdPipe implements PipeTransform {
    transform(value: List): string {
        return this.generateWidgetIdFromList(value);
    }

    /**
     * Generate Twitter widget id from given list.
     * @param list List to generate widget id from.
     * @returns Generated widget id in Twitter format.
     */
    private generateWidgetIdFromList(list: List): string {
        let list_name: string = list.append ? list.name + list.append : list.name;
        list_name = list_name.toLowerCase().replace(/\s*\W+/g, '_');

        return 'list:' + list.owner_screen_name + ':' + list_name;
    }
}
