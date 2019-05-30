import { Component } from '@angular/core';

@Component({
    selector: 'app-favorites',
    templateUrl: './views/favorites.component.html'
})
export class FavoritesComponent {
    onSelect(event: Event) {
        console.log(event);
        const elem: Element | null = event.target as Element;
        const card: Element | null = elem.closest('.card');

        if (!card) {
            return;
        }

        card.classList.toggle('deactivate');

        // Save selection??
    }
}
