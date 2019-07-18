import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AboutComponent } from './components/about.component';
import { AppComponent } from './components/app.component';
import { ErrorComponent } from './components/error.component';
import { FavoritesComponent } from './components/favorites.component';
import { HeaderComponent } from './components/header.component';
import { IntroComponent } from './components/intro.component';
import { ListsComponent } from './components/lists.component';
import { ListsOverlayComponent } from './components/lists-overlay.component';
import { ListUrlPipe } from './pipes/list_url.pipe';
import { ListWidgetIdPipe } from './pipes/list_widget-id.pipe';
import { TopicsComponent } from './components/topics.component';
import { TopicsOverlayComponent } from './components/topics-overlay.component';
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
        AboutComponent,
        AppComponent,
        ErrorComponent,
        FavoritesComponent,
        HeaderComponent,
        IntroComponent,
        ListsComponent,
        ListsOverlayComponent,
        ListUrlPipe,
        ListWidgetIdPipe,
        TopicsComponent,
        TopicsOverlayComponent,
        TwistsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
