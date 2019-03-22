import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {RouterModule, ROUTES} from '@angular/router';
import {AppComponent} from './app.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {HomeComponent} from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BsDatepickerModule} from "ngx-bootstrap";

import {LOCALE_ID} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import localeDECH from '@angular/common/locales/de-CH';


import {GruppenListeComponent} from "./components/gruppe/gruppen-liste.component";
import {AboutComponent} from "./components/about/about.component";
import {PageNotFoundComponent} from "./components/pagenotfound.component/pagenotfound.component";
import {GruppeEditComponent} from "./components/gruppe/gruppe-edit.component";
import {Code_aktivitaetenEditComponent} from "./components/code_aktivitaeten/code_aktivitaeten-edit.component";
import {Code_aktivitaetenListeComponent} from "./components/code_aktivitaeten/code_aktivitaeten-liste.component";
import {TeilnehmerListeComponent} from "./components/teilnehmer/teilnehmer-liste.component";
import {TeilnehmerEditComponent} from "./components/teilnehmer/teilnehmer-edit.component";
import {TeilnehmerEinladungComponent} from "@app/components/teilnehmer/teilnehmer-einladung.component";
import {TerminEditComponent} from "./components/termin/termin-edit.component";
import {TerminListeComponent} from "./components/termin/termin-liste.component";

import {PlanerdataService} from "./services/planerdata.service";
import {KalenderComponent} from "./components/kalender/kalender.component";
import {FlatpickrModule} from 'angularx-flatpickr';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxJsonViewerModule} from "ngx-json-viewer";
import {NavbarService} from "./services/navbar.service";
import { LayoutModule } from '@angular/cdk/layout';
import {GlobalVariables} from "./global.variables";
import {ResizeService} from "./services/resize.service";
import {RegisterComponent} from "./register";
import {LoginComponent} from "./login";
import {AuthGuard} from "./_guards";
import {ErrorInterceptor, JwtInterceptor} from "./_helpers";
import {AlertComponent} from "./_components";
import {APP_ROUTES} from "./app.routing";
import {EinladungComponent} from "@app/components/einladung/einladung.component";
import { TerminKalenderlisteComponent } from './components/termin/termin-kalenderliste/termin-kalenderliste.component';
import { GruppeDetailComponent } from './components/gruppe/gruppe-detail/gruppe-detail.component';
import {SmoothScrollDirective} from '@app/smoothscroll.directive';
import {InmemorydataService} from '@app/services/inmemorydata.service';
import {BackgroundcolorDirective} from '@app/backgroundcolor.directive';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

registerLocaleData(localeDECH);

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    EinladungComponent,
    AlertComponent,
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    GruppenListeComponent,
    GruppeEditComponent,
    GruppeDetailComponent,
    Code_aktivitaetenEditComponent,
    Code_aktivitaetenListeComponent,
    TeilnehmerListeComponent,
    TeilnehmerEditComponent,
    TeilnehmerEinladungComponent,
    TerminEditComponent,
    TerminListeComponent,
    KalenderComponent,
    AboutComponent,
    PageNotFoundComponent,
    TerminKalenderlisteComponent,
    GruppeDetailComponent,
    SmoothScrollDirective,
    BackgroundcolorDirective
  ],
  imports: [
    RouterModule.forRoot(APP_ROUTES , {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    LayoutModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxJsonViewerModule,
    BsDatepickerModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      },
    ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
    RouterModule
  ],
providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    PlanerdataService,
    NavbarService,
    ResizeService,
    InmemorydataService,
    GlobalVariables, // als Singleton benutzen, dh. bei keiner anderen Komponente zusätzlich als Provider eintragen! (Grund: diese Variablen werden u.U. von anderen Komponenten verändert)
    {provide: LOCALE_ID, useValue: 'de-ch'}],

  bootstrap: [AppComponent]
})

export class AppModule {
}
