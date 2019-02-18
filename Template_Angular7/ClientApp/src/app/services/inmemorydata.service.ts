import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {$} from 'protractor';
import {PlanerdataService} from '@app/services/planerdata.service';
import {environment} from '@environments/environment';
import {GlobalVariables} from '@app/global.variables';

@Injectable()
export class InmemorydataService {
  private userdata;
  private gruppenProUser: Gruppe[];
  private terminDatenProUser: TerminTeilnehmer[];
  private termineProUser: Termin[];
  private idGruppe: number;

  constructor(private http: HttpClient,
              private loadDataService: PlanerdataService,
              private globals: GlobalVariables) { }


  getTermineProUser(idGruppe: number) {

    if(!this.termineProUser) {
      let url = `${environment.apiUrl}/api/termine/termine_group_date/` + idGruppe;
      this.http.get<TerminTeilnehmer[]>(url).subscribe(res => {
        this.terminDatenProUser = res;
        url = `${environment.apiUrl}/api/termine/vtermine/` + idGruppe;
        this.http.get<Termin[]>(url).subscribe(res => {
          this.termineProUser = res;
          this.globals.isloadingData = false;
        }, error => console.error(error));
      }, error => console.error(error));
    }

  }

  getData(idUser: number) {
    if(!this.gruppenProUser) {
      this.globals.isloadingData = true;
      let url = `${environment.apiUrl}/api/gruppen/proUser/` + idUser;
      this.http.get<Gruppe[]>(url).subscribe(result => {
        this.gruppenProUser = result;
        if (this.GruppenProUserData) {
          //this.idGruppe = this.GruppenProUserData[0].Id;
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

  get TerminDatenProUser() {
    return this.terminDatenProUser;
  }

  get TermineProUserUndGruppe() {
    return this.termineProUser;
  }
}
