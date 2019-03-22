import { Component, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {PlanerdataService} from "../../services/planerdata.service";
import {Observable} from "rxjs";
import {GlobalVariables} from "../../global.variables";
import {environment} from "@environments/environment";

@Component({
  selector: "teilnehmer-liste",
  templateUrl: './teilnehmer-liste.component.html',
  styleUrls: ['./teilnehmer-liste.component.css']
})

export class TeilnehmerListeComponent implements OnChanges {
  @Input() myGruppe: Gruppe;
  myTeilnehmer: VTeilnehmer[];
  title: string;
  selectedTeilnehmer: VTeilnehmer;
  showAllData: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private http: HttpClient,
              private router: Router,
              private dataService: PlanerdataService,
              public globals: GlobalVariables) {

    this.title = "Teilnehmer";
    this.myTeilnehmer = [];
    this.showAllData = false;

    let id = +this.activatedRoute.snapshot.params["id"];  // Id der Gruppe
    if (this.activatedRoute.snapshot.url[1].path === "teilnehmer_user") {
      this.showAllData = true;
      this.myGruppe = <Gruppe>{};
      this.loadAlleTeilnehmerVonUser(id);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (typeof changes['myGruppe'] !== "undefined") {

      // retrieve code_aktivitaet variable change info
      let change = changes['myGruppe'];
      // only perform the task if the value has been changed
      if (!change.isFirstChange()) {
      // execute the Http request and retrieve the result
        this.loadVTeilnehmer(this.myGruppe.Id);
      }
    }
  }

  loadVTeilnehmer(id: number) {

    this.dataService.loadVTeilnehmer(id).subscribe( res => {
      this.myTeilnehmer = res;
    },
      error => console.error(error));
  }

  loadAlleTeilnehmerVonUser(id: number){
    let url = `${environment.apiUrl}/api/teilnehmer/teilnehmer_user/` + id;
    this.dataService.loadTeilnehmerVonUser(id).subscribe(res => {
      this.myTeilnehmer = res;
    },
      error => console.error(error));
  }

  onCreate() {
    this.router.navigate(["teilnehmer/create", this.myGruppe.Id]);
  }

  onEdit(myTeilnehmer : Teilnehmer) {
    this.router.navigate(["/teilnehmer/edit", myTeilnehmer.Id]);
  }

  onDelete(myTeilnehmer: Teilnehmer) {
    if (confirm("Soll diesr Teilnehmer gelöscht werden?")) {
      let url = `${environment.apiUrl}/api/teilnehmer/` + myTeilnehmer.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Teilnehmer " + myTeilnehmer.Id + " wurde gelöscht.");
          // refresh the question list
          this.loadVTeilnehmer(0);
        },
            error => console.log(error));
    }
  }
}
