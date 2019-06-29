import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { ColophonComponent } from './components/colophon.component';
import { ErrorComponent } from './components/error.component';
import { FavoritesComponent } from './components/favorites.component';
import { HeaderComponent } from './components/header.component';
import { IntroComponent } from './components/intro.component';
import { ListsComponent } from './components/lists.component';
import { ListUrlPipe } from './pipes/list_url.pipe';
import { ListWidgetIdPipe } from './pipes/list_widget-id.pipe';
import { TopicsComponent } from './components/topics.component';
import { TwistsComponent } from './components/twists.component';

// Import styles so they can be processed by Webpack
import '../sass/app.scss';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        ColophonComponent,
        ErrorComponent,
        FavoritesComponent,
        HeaderComponent,
        IntroComponent,
        ListsComponent,
        ListUrlPipe,
        ListWidgetIdPipe,
        TopicsComponent,
        TwistsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
