import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {GruppenListeComponent} from "./components/gruppe/gruppen-liste.component";
import {GruppeEditComponent} from "./components/gruppe/gruppe-edit.component";
import {Code_aktivitaetenListeComponent} from "./components/code_aktivitaeten/code_aktivitaeten-liste.component";
import {Code_aktivitaetenEditComponent} from "./components/code_aktivitaeten/code_aktivitaeten-edit.component";
import {TeilnehmerListeComponent} from "./components/teilnehmer/teilnehmer-liste.component";
import {TeilnehmerEditComponent} from "./components/teilnehmer/teilnehmer-edit.component";
import {TerminListeComponent} from "./components/termin/termin-liste.component";
import {TerminEditComponent} from "./components/termin/termin-edit.component";
import {KalenderComponent} from "./components/kalender/kalender.component";
import {AboutComponent} from "./components/about/about.component";

const appRoutes: Routes = [
  { path: '', component: GruppenListeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'home', component: GruppenListeComponent},
  {path: 'gruppen/alle/:count', component: GruppenListeComponent},
  {path: 'gruppen/create', component: GruppeEditComponent},
  {path: 'gruppen/edit/:id', component: GruppeEditComponent},
  {path: 'codesaktivitaeten/vaktivitaeten/:id', component: Code_aktivitaetenListeComponent}, // alle Aktivitäten der Gruppe x
  {path: 'codesaktivitaeten/create/:id', component: Code_aktivitaetenEditComponent},
  {path: 'codesaktivitaeten/edit/:id', component: Code_aktivitaetenEditComponent},
  {path: 'codesaktivitaeten/vaktivitaeten/0', component: Code_aktivitaetenListeComponent}, // alle Aktivitäten anzeigen
  {path: 'codesaktivitaeten/aktivitaeten_user/:id', component: Code_aktivitaetenListeComponent}, // alle Aktivitäten vom User
  {path: 'teilnehmer/alle/:id', component: TeilnehmerListeComponent},
  {path: 'teilnehmer/vteilnehmer/:id', component: TeilnehmerListeComponent},
  {path: 'teilnehmer/teilnehmer_user/:id', component: TeilnehmerListeComponent},
  {path: 'teilnehmer/create/:id', component: TeilnehmerEditComponent},
  {path: 'teilnehmer/edit/:id', component: TeilnehmerEditComponent},
  {path: 'termine/vtermine/:id', component: TerminListeComponent},
  {path: 'termine/termine_user/:id', component: TerminListeComponent}, // alle Termine vom User
  {path: 'termine/create/:id', component: TerminEditComponent},
  {path: 'termine/new_event', component: TerminEditComponent, data: {id: 0, myday: new Date()}},
  {path: 'termine/edit/:id', component: TerminEditComponent},
  {path: 'kalender/:id', component: KalenderComponent},
  {path: 'kalender_user/:id', component: KalenderComponent},
  {path: 'about', component: AboutComponent},
  //{path: '**', component: PageNotFoundComponent}
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
