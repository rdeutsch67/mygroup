import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {NavbarService} from "../../services/navbar.service";
import {GlobalVariables} from "@app/global.variables";
import {PlanerdataService} from "@app/services/planerdata.service";

@Component({
  selector: "gruppe-edit",
  templateUrl: './gruppe-edit.component.html',
  styleUrls: ['./gruppe-edit.component.css']
})

export class GruppeEditComponent implements OnInit {
  title: string;
  code: string;
  gruppe: Gruppe;
  form: FormGroup;
  editMode: boolean;  // this will be TRUE when editing an existing gruppe
                      // FALSE when creating a new one.

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              public nav: NavbarService,
              private globals: GlobalVariables,
              private loadDataService: PlanerdataService,
              @Inject('BASE_URL') private baseUrl: string) {

    // create an empty object from the Gruppe interface
    this.gruppe = <Gruppe>{};

    // initialize the form
    this.createForm();

    var id = +this.activatedRoute.snapshot.params["id"];
    if (id) {
      this.editMode = true;

      // fetch the gruppe from the server
      let url = this.baseUrl + "api/gruppen/" + id;
      this.http.get<Gruppe>(url).subscribe(res => {
        this.gruppe = res;
        this.code = "Edit - " + this.gruppe.Code;

        this.loadDataService.loadGruppenAdmin(this.gruppe.Id).subscribe((data) => {
            this.globals.gruppenAdmin = data;
          }
        );

        // update the form with the quiz value
        this.updateForm();
      }, error => console.error(error));
    }
    else {
      this.editMode = false;
      this.code = "Erstelle neue Gruppe";
    }
  }

  onSubmit() {
    // build a temporary quiz object from form values
    var tempGruppe = <Gruppe>{};
    tempGruppe.Code = this.form.value.Code;
    tempGruppe.Bezeichnung = this.form.value.Bezeichnung;
    tempGruppe.Beschreibung = this.form.value.Beschreibung;
    tempGruppe.Aktiv = this.form.value.Aktiv;

    var url = this.baseUrl + "api/gruppen";
    if (this.editMode) {
      // don't forget to set the tempGruppe Id,
      // otherwise the EDIT would fail!
      tempGruppe.Id = this.gruppe.Id;
      this.http
        .post<Gruppe>(url, tempGruppe)
        .subscribe(res => {
          this.gruppe = res;
          console.log("Gruppe " + this.gruppe.Id + " wurde mutiert.");
          //this.router.navigate(["home"]);
        }, error => console.log(error));
    }
    else {  // neue Gruppe erstellen
      tempGruppe.IdUser = this.globals.logged_in_User.id;
      this.http
        .put<Gruppe>(url, tempGruppe)
        .subscribe(res => {
          var q = res;
          console.log("Gruppe " + q.Id + " erstellt.");

          // Admin-Teilnehmer einfügen
          let tempTeilnehmer = <Teilnehmer>{};
          tempTeilnehmer.Vorname = this.globals.logged_in_User.firstName;
          tempTeilnehmer.Nachname = this.globals.logged_in_User.lastName
          tempTeilnehmer.Rufname = this.globals.logged_in_User.firstName;
          tempTeilnehmer.Email = this.globals.logged_in_User.email;
          tempTeilnehmer.IdGruppe = q.Id;
          tempTeilnehmer.EinladungAngenommen = new Date();

          let url = this.baseUrl + "api/teilnehmer";

          this.http
            .put<Teilnehmer>(url, tempTeilnehmer)
            .subscribe(res => {
              var tt = res;
              console.log("Teilnehmer " + tt.Id + " erstellt.");

            }, error => console.log(error));

          this.router.navigate(["gruppen/edit/"+q.Id]);
        }, error => console.log(error));
    }
  }

  onShowPlaner() {
    this.router.navigate(["kalender/"+this.gruppe.Id]);
  }

  onBack() {
    this.router.navigate(["home"]);
  }

  createForm() {
    this.form = this.fb.group({
      Code: ['', Validators.required],
      Bezeichnung: '',
      Beschreibung: '',
      Aktiv: false
    });
  }

  updateForm() {
    this.form.setValue({
      Code: this.gruppe.Code,
      Bezeichnung: this.gruppe.Bezeichnung || '',
      Beschreibung: this.gruppe.Beschreibung || '',
      Aktiv: this.gruppe.Aktiv
    });
  }

  ngOnInit() {
    this.nav.show();
  }
}


