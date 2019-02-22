import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlanerdataService} from '@app/services/planerdata.service';
import {environment} from '@environments/environment';
import {GlobalVariables} from '@app/global.variables';
import {Observable} from 'rxjs';

@Injectable()
export class InmemorydataService {
  private gruppenProUser: Gruppe[];
  private terminDatenProUser: TerminHeaderTeilnehmer[];
  private termineProUser: Termin[];
  private idGruppe: number;
  public gruppenAdmin: VTeilnehmer[];
  public teilnehmerProGruppe: Teilnehmer[];
  public aktivitaetenProGruppe: Code_aktivitaet[];
  public zzTerminAnzWiederholungen: ZzTerminAnzWiederholung[];

  constructor(private http: HttpClient,
              private loadDataService: PlanerdataService,
              private globals: GlobalVariables) { }



  Cleardata() {
    delete this.gruppenAdmin;
  }

  getGruppenAdmin(id: number): Observable<VTeilnehmer[]> {
    let url = `${environment.apiUrl}/api/teilnehmer/gruppenadmin/` + id;
    return this.http.get<VTeilnehmer[]>(url);
  }

  getTermineProUser(idGruppe: number) {
    if(!this.termineProUser) {
      let url = `${environment.apiUrl}/api/termine/termine_group_date/` + idGruppe;
      this.http.get<TerminHeaderTeilnehmer[]>(url).subscribe(res => {
        this.terminDatenProUser = res;
        url = `${environment.apiUrl}/api/termine/vtermine/` + idGruppe;
        this.http.get<Termin[]>(url).subscribe(res => {
          this.termineProUser = res;
          this.globals.isloadingData = false;
        }, error => console.error(error));
      }, error => console.error(error));
    }
  }

  get TerminDatenProUser() {
    return this.terminDatenProUser;
  }

  get TermineProUserUndGruppe() {
    return this.termineProUser;
  }


  // Teilnehmer pro Gruppe
  getTeilnehmerProGruppe(id: number): Observable<Teilnehmer[]> {
    let url = `${environment.apiUrl}/api/teilnehmer/alle/` + id;
    return this.http.get<Teilnehmer[]>(url);
  }

  get TeilnehmerProGruppe() {
    return this.teilnehmerProGruppe;
  }

  // Aktiviäten pro Gruppe
  getAktiviaetenProGruppe(id: number): Observable<Code_aktivitaet[]> {
    let url = `${environment.apiUrl}/api/codesaktivitaeten/alle/` + id;
    return this.http.get<Code_aktivitaet[]>(url);
  }

  get AktivitaetenProGruppe() {
    return this.aktivitaetenProGruppe;
  }

  // Gruppen pro User & wenn nur eine Gruppe vorhanden ist, gleich die Termine dieser Gruppe holen
  getData(idUser: number) {
    if(!this.gruppenProUser) {
      this.globals.isloadingData = true;
      let url = `${environment.apiUrl}/api/gruppen/proUser/` + idUser;
      this.http.get<Gruppe[]>(url).subscribe(result => {
        this.gruppenProUser = result;
        if (this.GruppenProUserData) {
          if (this.gruppenProUser.length === 1) {  // weitere Daten nur holen, wenn nur eine Gruppe vorhanden ist
            this.getTermineProUser(this.GruppenProUserData[0].Id)
          } else {
            this.globals.isloadingData = false;
          }
        } else {
          this.idGruppe = 0;
        }
      }, error => console.error(error));
    }
  }

  get GruppenProUserData() {
    return this.gruppenProUser;
  }

  // zzTabellen
  getzzTerminAnzWiederholungen(num: number): Observable<ZzTerminAnzWiederholung[]> {
    let url = `${environment.apiUrl}/api/zzterminanzwiederholungen/all/` + num;
    return this.http.get<ZzTerminAnzWiederholung[]>(url);
  }
}
