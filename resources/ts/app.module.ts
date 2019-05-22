import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { ColophonComponent } from './components/colophon.component';
import { FavoritesComponent } from './components/favorites.component';
import { HeaderComponent } from './components/header.component';
import { MenuComponent } from './components/menu.component';
import { TwistsComponent } from './components/twists.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        ColophonComponent,
        FavoritesComponent,
        HeaderComponent,
        MenuComponent,
        TwistsComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
