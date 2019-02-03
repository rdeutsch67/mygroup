import {Component, DoCheck, Inject, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {NavbarService} from "@app/services/navbar.service";
import {GlobalVariables} from "@app/global.variables";
import {PlanerdataService} from "@app/services/planerdata.service";
import {Subscription} from "rxjs";
import {Einladungbestaetigung} from "@app/interface/special/einladungbestaetigung";

@Component({
  selector: "einladung",
  templateUrl: './einladung.component.html',
  styleUrls: ['./einladung.component.css']
})

export class EinladungComponent {
  emailTeilnehmer: string;
  sub: Subscription;
  code: number;
  einladungbestaetigung: Einladungbestaetigung;
  commitresult: Einladungbestaetigung;


  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private dataService: PlanerdataService,
              private globals: GlobalVariables,
              @Inject('BASE_URL') private baseUrl: string) {

    globals.mode_ConfirmInvitation = false;
    this.einladungbestaetigung = <Einladungbestaetigung>{};
    let paramIdp: string = this.activatedRoute.snapshot.params["idp"];
    let entStr = decodeURIComponent(atob(paramIdp));

    let aPos = entStr.indexOf(";grp");
    let strEmail = entStr.substr(0, aPos);
    let strGruppe = entStr.substr(aPos+5, 99);

    this.emailTeilnehmer = "Email: "+ strEmail+"  Gruppe: "+strGruppe;

    this.einladungbestaetigung.Gruppe = +strGruppe;
    this.einladungbestaetigung.Email = strEmail;

    //commitEinladung
    dataService.commitEinladung(this.einladungbestaetigung)
      .subscribe( (data) => {
        this.commitresult = data;
        globals.mode_ConfirmInvitation = true;
      },
      error => console.error(error));
  }

  onShowGruppe() {
    this.router.navigate(["gruppen/edit", this.commitresult.Gruppe]);
  }


}
