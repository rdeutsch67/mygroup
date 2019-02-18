import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Observer} from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarUtils,
  CalendarView
} from 'angular-calendar';
import {NgIf} from "@angular/common";
import {addDays, addHours, endOfMonth, startOfDay, subDays} from "date-fns";
import {Einladungbestaetigung} from "@app/interface/special/einladungbestaetigung";
import {map} from "rxjs/operators";
import {environment} from '@environments/environment';

@Injectable()
export class PlanerdataService {
  //baseUrl: string;

  constructor(private http: HttpClient
              //@Inject('BASE_URL') private baseUrl: string
) {
    //this.baseUrl = `${environment.apiUrl}`;
  }

  loadTeilnehmer(id: number): Observable<Teilnehmer[]> {

    let myUrl: string;
    if (id > 0) {
      myUrl = `${environment.apiUrl}/api/teilnehmer/alle/` + id;
    } else {
      myUrl = `${environment.apiUrl}/api/teilnehmer/alle/0`;  // alle holen
    }

    return this.http.get<Teilnehmer[]>(myUrl);
  }

  loadVTeilnehmer(id: number): Observable<VTeilnehmer[]> {

    let myUrl: string;
    if (id > 0) {
      myUrl = `${environment.apiUrl}/api/teilnehmer/vteilnehmer/` + id;
    } else {
      myUrl = `${environment.apiUrl}/api/teilnehmer/vteilnehmer/0`;  // alle holen
    }

    return this.http.get<VTeilnehmer[]>(myUrl);
  }

  loadTeilnehmerVonUser(id: number): Observable<VTeilnehmer[]> {

    let myUrl: string;
    if (id > 0) {
      myUrl = `${environment.apiUrl}/api/teilnehmer/teilnehmer_user/` + id;
    } else {
      myUrl = `${environment.apiUrl}/api/teilnehmer/vteilnehmer/0`;  // alle holen
    }

    return this.http.get<VTeilnehmer[]>(myUrl);
  }

  loadGruppenAdmin(id: number): Observable<VTeilnehmer[]> {

    let myUrl: string;
    if (id > 0) {
      myUrl = `${environment.apiUrl}/api/teilnehmer/gruppenadmin/` + id;
    }

    return this.http.get<VTeilnehmer[]>(myUrl);
  }

  loadAktiviaeten(id: number): Observable<Code_aktivitaet[]> {
    let myUrl: string;
    if (id > 0) {
      myUrl = `${environment.apiUrl}/api/codesaktivitaeten/alle/` + id;
    } else {
      myUrl = `${environment.apiUrl}/api/codesaktivitaeten/alle/0`;  // alle holen
    }

    return this.http.get<Code_aktivitaet[]>(myUrl);
  }

  loadTermine(myID: number, fetchAllCalenderEventsOfUser: number): Observable<Termin[]> {
    let myUrl: string;
    if (fetchAllCalenderEventsOfUser <= 0) {
      if (myID > 0) {
        myUrl = `${environment.apiUrl}/api/termine/vtermine/` + myID;
      } else {
        myUrl = `${environment.apiUrl}/api/termine/vtermine/0`;  // alle holen
      }
    } else {
      myUrl = `${environment.apiUrl}/api/termine/termine_user/` + fetchAllCalenderEventsOfUser;
    }

    return this.http.get<Termin[]>(myUrl);
  }

  loadPlanerCalenderEvents(myID: number, fetchAllCalenderEventsOfUser: number): Observable<CalendarEvent[]> {


    let termine: Termin[];
    let calEvent: CalendarEvent;
    let terminEvents: CalendarEvent[];

    terminEvents = [];

    return Observable.create(observer => {
        setTimeout(() => {
          this.loadTermine(myID, fetchAllCalenderEventsOfUser)
            .subscribe((data) => {
                termine = data;

                if (termine.length > 0) {
                  for (let i = 0; i < termine.length; i++) {
                    calEvent = <CalendarEvent>{};
                    calEvent.start = new Date(termine[i].DatumBeginn);
                    calEvent.end = new Date(termine[i].DatumEnde);
                    var myColors: any = {
                      myTerminColor: {
                        primary: termine[i].AktFarbe,
                        secondary: termine[i].AktFarbe
                      }
                    };
                    calEvent.color = myColors.myTerminColor;
                    calEvent.title = termine[i].TnVorname + " " + termine[i].TnNachname + ": " + termine[i].AktBezeichnung;
                    calEvent.draggable = false;
                    if (termine[i].AktSummieren) {
                      calEvent.meta = 'sum'
                    } else {
                      calEvent.meta = 'notsum'
                    }

                    terminEvents.push(calEvent);  // zum Array hinzufügen
                  }
                  observer.next(terminEvents);
                  observer.complete();
                }
              }
            );

        }, 10);
      }
    );
  }

  loadZzTerminAnzWiederholungen(num: number): Observable<ZzTerminAnzWiederholung[]> {
    let myUrl: string;
    myUrl = `${environment.apiUrl}/api/zzterminanzwiederholungen/all/` + num;

    return this.http.get<ZzTerminAnzWiederholung[]>(myUrl);
  }

  commitEinladung(params: Einladungbestaetigung): Observable<Einladungbestaetigung> {

    let myUrl: string;
    myUrl = `${environment.apiUrl}/api/teilnehmer/confirm_groupmember`;

    return this.http.post<Einladungbestaetigung>(myUrl, params);

  }

}


