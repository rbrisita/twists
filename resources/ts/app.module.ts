import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { ColophonComponent } from './components/colophon.component';
import { FavoritesComponent } from './components/favorites.component';
import { HeaderComponent } from './components/header.component';
import { IntroComponent } from './components/intro.component';
import { ListsComponent } from './components/lists.component';
import { ListUrlPipe } from './pipes/list_url.pipe';
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
        FavoritesComponent,
        HeaderComponent,
        IntroComponent,
        ListsComponent,
        ListUrlPipe,
        TopicsComponent,
        TwistsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
