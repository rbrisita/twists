import { Component, VERSION } from '@angular/core';

@Component({
    selector: 'app-main',
    template: '<h1>Angular v{{ version }}</h1>'
})

export class AppComponent {
    version = VERSION.full;
}
