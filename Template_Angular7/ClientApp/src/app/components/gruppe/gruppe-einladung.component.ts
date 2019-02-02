import {Component, DoCheck, Inject, Input, OnInit} from "@angular/core";
import { Router} from "@angular/router";

@Component({
  selector: "gruppe-einladung",
  templateUrl: './gruppe-einladung.component.html',
  styleUrls: ['./gruppe-einladung.component.css']
})

export class GruppeEinladungComponent implements OnInit, DoCheck {
  @Input() idGruppe: number;
  @Input() myTeilnehmer: Teilnehmer;

  strNameTeilnehmer: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }

  ngDoCheck() {
    this.strNameTeilnehmer = this.myTeilnehmer.Vorname+" "+this.myTeilnehmer.Nachname;
  }

  onBack() {
    this.router.navigate(["home"]);
  }

}
