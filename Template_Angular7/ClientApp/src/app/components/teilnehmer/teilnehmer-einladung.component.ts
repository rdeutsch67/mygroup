import {Component, DoCheck, Inject, Input, OnInit} from "@angular/core";
import {GlobalVariables} from "@app/global.variables";

@Component({
  selector: "teilnehmer-einladung",
  templateUrl: './teilnehmer-einladung.component.html',
  styleUrls: ['./teilnehmer-einladung.component.css']
})

export class TeilnehmerEinladungComponent implements OnInit, DoCheck {
  @Input() idGruppe: number;
  @Input() myTeilnehmer: Teilnehmer;

  strNameTeilnehmer: string;
  strEinladung: string;
  strEmail: string;
  showEmailref: boolean = false;

  constructor(
    private globals: GlobalVariables,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  ngOnInit() {
    this.strEinladung = '';
    this.strEmail = undefined;
  }

  ngDoCheck() {
    this.strNameTeilnehmer = this.myTeilnehmer.Vorname+" "+this.myTeilnehmer.Nachname;

    let strCode = btoa(encodeURIComponent(this.myTeilnehmer.Email + ";grp=" + this.idGruppe));
    //let url = this.baseUrl + "gruppe_einladung/"+ "?gruppe="+this.idGruppe+"&teilnehmer="+this.myTeilnehmer.Id;
    let url = this.baseUrl + "confirm/:idp;idp="+strCode;



    let emailBody =  "Hallo "+this.myTeilnehmer.Vorname
                    +"\r\n\nWir möchten dich in unsere Gruppe einladen."
                    +"\r\n\nMit diesem Link bestätigst du die Teilnahme:  "+url
                    +"\r\n\nBeste Grüsse"
                    +"\r\n\nder Gruppenleiter "+this.globals.gruppenAdmin[0].Vorname;

    this.strEmail =
      "mailto:"   + encodeURIComponent(this.myTeilnehmer.Email) +
      "?subject=" + encodeURIComponent("Einladung in die Gruppe "+this.idGruppe) +
      "&body="    + encodeURIComponent( emailBody);
    this.showEmailref = true;
  }

  onGeneriereEinladung() {
    window.location.href = this.strEmail;
    this.showEmailref = true;
  }

}
