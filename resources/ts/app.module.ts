import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { MenuComponent } from './components/menu.component';
import { TwistsComponent } from './components/twists.component';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    declarations: [
        MenuComponent,
        TwistsComponent,
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
