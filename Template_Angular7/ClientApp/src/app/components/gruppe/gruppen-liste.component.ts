import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import {NavbarService} from "../../services/navbar.service";
import {GlobalVariables} from "../../global.variables";
import {environment} from '@environments/environment';
import {InmemorydataService} from '@app/services/inmemorydata.service';

@Component({
  selector: "gruppen-liste",
  templateUrl: './gruppen-liste.component.html',
  styleUrls: ['./gruppen-liste.component.css']
})

export class GruppenListeComponent implements OnInit {
  title: string;
  selectedGruppe: Gruppe;
  gruppen: Gruppe[];

  /*resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;*/
  //count: number;

  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public nav: NavbarService,
              public globals: GlobalVariables,
              private dataService: InmemorydataService
              //@Inject('BASE_URL') private baseUrl: string
) {

    this.title = "Gruppen";
    this.gruppen = [];

    let count = +this.activatedRoute.snapshot.params["count"];
    if (isNaN(count)) {
      count = 0;
    };
    //this.loadData(this.globals.logged_in_User.id);
    this.gruppen = this.dataService.GruppenProUserData;
    this.globals.appTitle = this.globals.logged_in_User.firstName+" s'Planer";

  }

  ngOnInit() {
    //this.dataService.getData(this.globals.logged_in_User.id);
    this.nav.show();
  }

  loadData(idUser: number) {
    console.log(idUser);
    let url = `${environment.apiUrl}/api/gruppen/proUser/` + idUser;
    this.http.get<Gruppe[]>(url).subscribe(result => {
      this.gruppen = result;
    }, error => console.error(error));
  }

  onCreate() {
    this.router.navigate(["gruppen/create"]);
  }

  onShowPlaner(gruppe : Gruppe){
    this.router.navigate(["kalender/"+ gruppe.Id]);
  }

  onEdit(gruppe : Gruppe) {
    //this.onSelect(gruppe);
    this.selectedGruppe = gruppe;
    console.log("Gruppe mit Id " + this.selectedGruppe.Id + " ist ausgewählt.");
    this.router.navigate(["gruppen/edit", this.selectedGruppe.Id]);
  }

  onDelete(gruppe : Gruppe) {
    if (confirm("Soll diese Gruppe gelöscht werden?")) {
      let url = `${environment.apiUrl}/api/gruppen/` + gruppe.Id;
      this.http
        .delete(url)
        .subscribe(res => {
          console.log("Gruppe " + gruppe.Id + " wurde gelöscht.");

          this.router.navigate(["/gruppen/alle/10"]);
        }, error => console.log(error));
    }
  }

  onSelect(gruppe: Gruppe) {
    this.selectedGruppe = gruppe;
    console.log("Gruppe mit Id " + this.selectedGruppe.Id + " ist ausgewählt.");
    //this.router.navigate(["gruppen/edit", this.selectedGruppe.Id]);
    this.router.navigate(["gruppen/show", this.selectedGruppe.Id]);
  }
}

