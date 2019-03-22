import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BsDatepickerConfig} from 'ngx-bootstrap';
import {PlanerdataService} from '../../services/planerdata.service';
import * as moment from 'moment';
import {NavbarService} from '../../services/navbar.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {GlobalVariables} from '../../global.variables';
import {ResizeService} from '../../services/resize.service';
import {environment} from '@environments/environment';
import {encodeUriFragment} from '@angular/router/src/url_tree';
import {InmemorydataService} from '@app/services/inmemorydata.service';

@Component({
  selector: 'termin-edit.component',
  templateUrl: './termin-edit.component.html',
  styleUrls: ['./termin-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TerminEditComponent implements OnInit, AfterViewInit {
  title: string;
  master: string;
  dataIsLoading: boolean = true;
  editMode: boolean;
  inputReadonly: boolean = false;
  flagDatenGespeichert: boolean = false;
  neuerTermin: boolean;
  backroute: string;
  backrouteId: number;
  showDataJson: boolean = true;
  showDataJsonTitle: string;
  showDebugInfoBtnClass: string;
  showDataJsonBtnIcon: string;
  myTermin: Termin;
  myDayBackroute: string;
  aktTerminDatBeginn = new Date();
  aktTerminDatEnde = new Date();
  selGanzerTag: boolean;
  form: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig>;
  bsValue = new Date();
  // Auswahlboxen
  //selGruppen: Gruppe[];
  selectedGruppe: number;
  selectedAktivitaet: number;

  selTeilnehmer: Teilnehmer[];
  selAktivitaeten: Code_aktivitaet[];

  zzTerminAnzWiederholungen: ZzTerminAnzWiederholung[];
  resizeSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private fb: FormBuilder,
              private loadDataService: PlanerdataService,
              private dataService: InmemorydataService,
              public globals: GlobalVariables,
              private resizeService: ResizeService,
              private cdRef: ChangeDetectorRef) {

    this.datePickerConfig = Object.assign({}, {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD.MM.YYYY',
      showWeekNumbers: false
    });

    // create an empty object from the Gruppe interface
    this.myTermin = <Termin>{};
    // init Comboboxinhalte
    //this.selGruppen = <Gruppe[]>{};
    this.selTeilnehmer = <Teilnehmer[]>{};
    this.selAktivitaeten = <Code_aktivitaet[]>{};
    this.zzTerminAnzWiederholungen = <ZzTerminAnzWiederholung[]>{};
  }

  loadData(idTermin: number) {
    if (this.editMode) {
      // Termin holen
      let url = `${environment.apiUrl}/api/termine/` + idTermin;
      this.http.get<Termin>(url).subscribe(res => {
        this.myTermin = res;
        //this.inputReadonly = (this.myTermin.TnEmail != this.globals.logged_in_User.email);
        this.title = 'Edit - ' + idTermin;
        this.master = '(' + this.myTermin.IdTermin + ')';
        this.aktTerminDatBeginn = new Date(this.myTermin.DatumBeginn);
        this.aktTerminDatEnde = new Date(this.myTermin.DatumEnde);

        if (!this.dataService.teilnehmerProGruppe) {
          this.dataService.getTeilnehmerProGruppe(this.myTermin.IdGruppe).subscribe((data) => {
              this.selTeilnehmer = data;
              this.dataService.teilnehmerProGruppe = data;
              if (!this.dataService.aktivitaetenProGruppe) {
                this.dataService.getAktiviaetenProGruppe(this.myTermin.IdGruppe).subscribe((data) => {
                    this.selAktivitaeten = data;
                    this.dataService.aktivitaetenProGruppe = data;
                    // update the form
                    this.dataIsLoading = false;  // Ende Daten holen
                    this.updateForm();
                    this.cdRef.detectChanges(); // refresh
                  }
                );
              } else {
                // update the form
                this.dataIsLoading = false;  // Ende Daten holen
                this.updateForm();
                this.cdRef.detectChanges(); // refresh
              }
            }
          )
        } else {
          this.selTeilnehmer = this.dataService.TeilnehmerProGruppe;
          this.selAktivitaeten = this.dataService.AktivitaetenProGruppe;
          this.dataIsLoading = false;  // Ende Daten holen
          this.updateForm();
          this.cdRef.detectChanges(); // refresh
        }
      }, error => console.error(error));
    } else {  // neuer Termin erfassen
      this.title = 'neuer Termin';
      this.master = '';

      let myday: Date = this.activatedRoute.snapshot.params['myday'];
      this.myDayBackroute = this.activatedRoute.snapshot.params['myday'];

      if (myday) {
        this.myTermin.DatumBeginn = new Date(myday);
      } else {
        this.myTermin.DatumBeginn = new Date();
      }
      this.myTermin.IdGruppe = idTermin;
      this.myTermin.IdTeilnehmer = this.globals.logged_in_User.id;
      this.myTermin.GanzerTag = false;


      this.loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe((data) => {
          this.selAktivitaeten = data;
          if (this.globals.loginUserIstGruppenAdmin) { // dann noch alle Gruppenteilnehmer laden
            this.loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe((data) => {
              this.selTeilnehmer = data;
              // update the form
              this.dataIsLoading = false;  // Ende Daten holen
              this.updateForm();
              this.cdRef.detectChanges(); // refresh
            });
          } else {
            // update the form
            this.dataIsLoading = false;  // Ende Daten holen
            this.updateForm();
            this.cdRef.detectChanges(); // refresh
          }
          ;
        }
      );

      /*this.loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe((data) => {
          this.selTeilnehmer = data;
          this.loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe((data) => {
              this.selAktivitaeten = data;
              // update the form
              this.dataIsLoading = false;  // Ende Daten holen
              this.updateForm();
              this.cdRef.detectChanges(); // refresh
            }
          );
        }
      );*/


      /*let url = `${environment.apiUrl}/api/gruppen/` + this.myTermin.IdGruppe;
      this.http.get<Gruppe>(url).subscribe(res => {
        this.selGruppen = Array.of(res);
        this.loadDataService.loadTeilnehmer(this.myTermin.IdGruppe).subscribe((data) => {
            this.selTeilnehmer = data;
            this.loadDataService.loadAktiviaeten(this.myTermin.IdGruppe).subscribe((data) => {
                this.selAktivitaeten = data;
                // update the form
                this.dataIsLoading = false;  // Ende Daten holen
                this.updateForm();
                this.cdRef.detectChanges(); // refresh
              }
            );
          }
        );
      }, error => console.error(error));*/
    }
  }

  ngOnInit() {
    this.InitFormFields();

    if (!this.dataService.zzTerminAnzWiederholungen) {
      this.dataService.getzzTerminAnzWiederholungen(15).subscribe((data) => {
          this.zzTerminAnzWiederholungen = data;
          this.dataService.zzTerminAnzWiederholungen = data;
        }
      )
    } else {
      this.zzTerminAnzWiederholungen = this.dataService.zzTerminAnzWiederholungen;
    };

    // initialize the form
    this.createForm();

    let id = +this.activatedRoute.snapshot.params['id'];

    // check if we're in edit mode or not
    this.editMode = (this.activatedRoute.snapshot.url[1].path === 'edit');
    this.neuerTermin = (this.activatedRoute.snapshot.url[1].path === 'create');
    if (!this.neuerTermin) {
      this.inputReadonly = this.activatedRoute.snapshot.params['ro'].toUpperCase() === 'TRUE';
    }
    // eine evtl. mitgeschickte Backroute lesen
    this.backroute = this.activatedRoute.snapshot.params['routesource'];
    //let aParam = this.activatedRoute.snapshot.params[0];
    if (this.backroute) {
      //let aPos = this.backroute.indexOf(':id');
      //this.backroute = this.backroute.substr(0, aPos);
      this.backrouteId = this.activatedRoute.snapshot.params['routesourceId'];
    }
    this.loadData(id);
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  onDelete(termin: Termin) {
    /*const filterByIdAndDatumBeginn = (resTermine: Termin[]) =>
      resTermine.filter(x => ((x.IdTermin == termin.IdTermin) && (termin.IdTermin > 0)
        && (x.DatumBeginn >= termin.DatumBeginn)));
    const sortByDatumBeginn = (resTermine: Termin[]) =>
      resTermine.sort((terminA: Termin, terminB: Termin) => {
        if (terminA.DatumBeginn > terminB.DatumBeginn) return 1;
        return -1;
      });

    let myTermine =  filterByIdAndDatumBeginn(this.termine);
    myTermine =  sortByDatumBeginn(myTermine);

    if (myTermine.length > 1) {
      if (confirm("Sollen dieser und alle nachfolgenden Termine von diesem Typ (IdTermin = "+termin.IdTermin+") gelöscht werden?")) {
        for (let i: number = 0; i <= myTermine.length; i++) {
          let url = `${environment.apiUrl}/api/termine/` + myTermine[i].Id;
          this.http
            .delete(url)
            .subscribe(res => {
              console.log("Termin " + termin.Id + " wurde gelöscht.");
              // refresh the question list
              this.loadData(0);
            }, error => console.log(error));
        }
      }
    }
    else {*/
      if (confirm("Soll dieser Termin ("+termin.AktCode+" vom "+ moment(termin.DatumBeginn, "DD.MM.YYYY")+") gelöscht werden?")) {
        let url = `${environment.apiUrl}/api/termine/` + termin.Id;
        this.http
          .delete(url)
          .subscribe(res => {
            console.log("Termin " + termin.Id + " wurde gelöscht.");
            // refresh the question list
            //this.loadData(0);

            // beim Ausstieg aus diesem Bildschirm folgende Daten neu holen
            // this.dataService.TerminDatenProUser;
            // this.termine = this.dataService.TermineProUserUndGruppe;


            this.flagDatenGespeichert = true;
            this.onBack()
          }, error => console.log(error));
      }
    /*}*/
  }

  onBack() {
    if (this.backroute) {
      if (this.neuerTermin) {
        //this.router.navigate([this.backroute, this.backrouteId], {fragment: '_th' + this.myDayBackroute});
        this.router.navigate([this.backroute, {
          id: this.backrouteId,
          reload: this.flagDatenGespeichert
        }], {fragment: '_th' + this.myDayBackroute});
      } else {
        //this.router.navigate([this.backroute, this.backrouteId], {fragment: '_t' + this.myTermin.Id.toString()});
        this.router.navigate([this.backroute, {
          id: this.backrouteId,
          reload: this.flagDatenGespeichert
        }], {fragment: '_t' + this.myTermin.Id.toString()});
      }
    } else {
      this.router.navigate(['gruppen/edit', this.myTermin.IdGruppe]);
    }
  }

  InitFormFields() {
    this.form = this.fb.group({
      DatumBeginn: new Date(),
      DatumEnde: '',
      GanzerTag: false,
      ZeitBeginn: '10:00',
      ZeitEnde: '11:00',
      AnzWiederholungen: '',
      MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
      IdGruppe: '',
      IdTeilnehmer: '',
      IdAktivitaet: '',
      Hinweis: ''
    });
  }

  onChangeDatumBeginn(value: Date): void {
    let dtBeginn: Date = new Date(value);
    let dtEnde: Date = new Date(this.form.value.DatumEnde);
    if (moment(dtEnde, 'DD.MM.YYYY') < moment(dtBeginn, 'DD.MM.YYYY')) {
      this.form.patchValue(
        {
          DatumEnde: dtBeginn
        }
      );
    }
  }

  /*onChangeGruppe(newValue) {
    console.log(newValue);
    this.selectedGruppe = newValue;
    this.loadDataService.loadTeilnehmer(newValue).subscribe((data) => {
        this.selTeilnehmer = data;
        this.loadDataService.loadAktiviaeten(newValue).subscribe((data) => {
            this.selAktivitaeten = data;
          }
        );
      }
    );
  }*/

  onChangeAktivitaet(newValue, callOverride?: boolean, newGanzerTag?: boolean) {
    console.log(newValue);
    this.selectedAktivitaet = newValue;

    var selAktivitaet: Code_aktivitaet[];
    selAktivitaet = <Code_aktivitaet[]>{};
    selAktivitaet = this.selAktivitaeten.filter(x => x.Id == this.selectedAktivitaet);

    if ((selAktivitaet[0].GanzerTag == true) || (newGanzerTag == true)) {
      myZeitBeginn$ = '00:00';
      myZeitEnde$ = '23:59';
    } else {
      // Zeiten gemäss Codedefinition anzeigen
      if (!selAktivitaet[0].ZeitUnbestimmt) {
        var myZeitBeginn: Date = new Date(selAktivitaet[0].ZeitBeginn);
        var myZeitBeginn$ = ((myZeitBeginn.getHours() < 10 ? '0' : '') + myZeitBeginn.getHours()) + ':'
          + ((myZeitBeginn.getMinutes() < 10 ? '0' : '') + myZeitBeginn.getMinutes());
        var myZeitEnde: Date = new Date(selAktivitaet[0].ZeitEnde);
        var myZeitEnde$ = ((myZeitEnde.getHours() < 10 ? '0' : '') + myZeitEnde.getHours()) + ':'
          + ((myZeitEnde.getMinutes() < 10 ? '0' : '') + myZeitEnde.getMinutes());
      } else {
        let aDate = new Date();
        aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen
        myZeitBeginn$ = new Date().getHours().toString(10) + ':00';
        myZeitEnde$ = new Date(aDate).getHours().toString(10) + ':00';
      }

    }

    if (callOverride) {
      this.form.patchValue(
        {
          GanzerTag: newGanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
        }
      );
    } else {
      this.form.patchValue(
        {
          GanzerTag: selAktivitaet[0].GanzerTag,
          ZeitBeginn: myZeitBeginn$,
          ZeitEnde: myZeitEnde$,
        }
      );
    }
  }

  onClickGanzerTag(e) {
    this.selGanzerTag = e.target.checked;
    this.onChangeAktivitaet(this.form.value.IdAktivitaet, true, this.selGanzerTag);
  }

  onSubmit() {

    let FlagWHMo: boolean;
    let FlagWHDi: boolean;
    let FlagWHMi: boolean;
    let FlagWHDo: boolean;
    let FlagWHFr: boolean;
    let FlagWHSa: boolean;
    let FlagWHSo: boolean;

    function GetNextDay(myDate: Date, dayINeed: number): Date {
      // if we haven't yet passed the day of the week that I need:
      if (moment(myDate).isoWeekday() < dayINeed) {
        // then just give me this week's instance of that day
        return moment(myDate).isoWeekday(dayINeed).toDate();
      } else {
        // otherwise, give me next week's instance of that day
        return moment(myDate).add(1, 'weeks').isoWeekday(dayINeed).toDate();
      }
    }

    function HandleWiederholungen(myHttp: HttpClient) {

      let arrNxtWochentag: Date[] = [];
      // die nächsten Tagesdaten der gewählten Wochentage ermitteln (z.B. welches Datum hat der nächste Montag vom gewählten Startdatum aus gesehen)
      if (FlagWHMo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 1));
      }
      ;
      if (FlagWHDi == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 2));
      }
      ;
      if (FlagWHMi == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 3));
      }
      ;
      if (FlagWHDo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 4));
      }
      ;
      if (FlagWHFr == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 5));
      }
      ;
      if (FlagWHSa == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 6));
      }
      ;
      if (FlagWHSo == true) {
        arrNxtWochentag.push(GetNextDay(tempTermin.DatumBeginn, 7));
      }
      ;

      // Differenz vom Ende- zum Startdatum ermitteln
      let startdate = moment(tempTermin.DatumBeginn, 'DD.MM.YYYY');
      let enddate = moment(tempTermin.DatumEnde, 'DD.MM.YYYY');
      let daydiff: number = enddate.diff(startdate, 'days');

      // gemäss Anzahl Wiederholungen die Start- und Endedaten berechnen und in die Termine einfügen
      if (AnzahlWH > 0) {
        for (let d = 0; d <= arrNxtWochentag.length - 1; d++) {
          for (let i = 0; i <= AnzahlWH - 1; i++) {
            // DatumBeginn
            let DatumBeginnWH: Date = new Date(arrNxtWochentag[d]);
            DatumBeginnWH.setDate(DatumBeginnWH.getDate() + (7 * i));
            let curDatumBeginn: Date = new Date(tempTermin.DatumBeginn);
            tempTermin.DatumBeginn = new Date(DatumBeginnWH.getFullYear(), DatumBeginnWH.getMonth(), DatumBeginnWH.getDate(),
              curDatumBeginn.getHours(), curDatumBeginn.getMinutes(), curDatumBeginn.getSeconds(), curDatumBeginn.getMilliseconds());
            // DatumEnde
            let DatumEndeWH: Date = new Date(tempTermin.DatumBeginn);
            DatumEndeWH.setDate(tempTermin.DatumBeginn.getDate() + daydiff);
            let curDatumEnde: Date = new Date(tempTermin.DatumEnde);
            tempTermin.DatumEnde = new Date(DatumEndeWH.getFullYear(), DatumEndeWH.getMonth(), DatumEndeWH.getDate(),
              curDatumEnde.getHours(), curDatumEnde.getMinutes(), curDatumEnde.getSeconds(), curDatumEnde.getMilliseconds());

            tempTermin.IdTermin = myIdMaster;
            myHttp
              .put<Termin>(url, tempTermin)
              .subscribe(res => {
                let q = res;
                console.log('Termin ' + q.Id + ' erstellt.');
              }, error => console.log(error));
          }
        }
      }
    }

    FlagWHMo = this.form.value.MoWH;
    FlagWHDi = this.form.value.DiWH;
    FlagWHMi = this.form.value.MiWH;
    FlagWHDo = this.form.value.DoWH;
    FlagWHFr = this.form.value.FrWH;
    FlagWHSa = this.form.value.SaWH;
    FlagWHSo = this.form.value.SoWH;

    let AnzahlWH: number = this.form.value.AnzWiederholungen;
    let WiederholungenVorhanden: boolean = (FlagWHMo || FlagWHDi || FlagWHMi || FlagWHDo || FlagWHFr || FlagWHSa || FlagWHSo) && (AnzahlWH > 0);

    // build a temporary termin object from form values
    let tempTermin = <Termin>{};

    tempTermin.GanzerTag = this.form.value.GanzerTag;
    let myIdMaster: number = 0;
    let myBeginnDate: Date = new Date(this.form.value.DatumBeginn);
    let myEndeDate: Date = new Date(this.form.value.DatumEnde);
    if (tempTermin.GanzerTag == true) {
      // Beginn
      myBeginnDate.setHours(0, 0, 0, 0);
      // Ende
      myEndeDate.setHours(23, 59, 59, 999);
    } else {
      // Beginn
      var myZeit: string = this.form.value.ZeitBeginn;           // hier ein Zeitstring z.B. "21:15" zurückgegeben
      var myHour = parseInt(myZeit.substring(0, 2), 10);
      var myMinutes = parseInt(myZeit.substring(3, 5), 10);
      myBeginnDate.setHours(myHour, myMinutes, 0, 0);
      // Ende
      myZeit = this.form.value.ZeitEnde;
      myHour = parseInt(myZeit.substring(0, 2), 10);
      myMinutes = parseInt(myZeit.substring(3, 5), 10);
      myEndeDate.setHours(myHour, myMinutes, 0, 0);
    }

    tempTermin.DatumBeginn = myBeginnDate;
    tempTermin.DatumEnde = myEndeDate;
    tempTermin.IdGruppe = this.form.value.IdGruppe;
    tempTermin.IdTeilnehmer = this.form.value.IdTeilnehmer;
    tempTermin.IdAktivitaet = this.form.value.IdAktivitaet;
    tempTermin.Hinweis = this.form.value.Hinweis;

    var url = `${environment.apiUrl}/api/termine`;
    if (this.editMode) {
      // don't forget to set the Id,
      // otherwise the EDIT would fail!
      tempTermin.Id = this.myTermin.Id;
      if (WiederholungenVorhanden) {
        tempTermin.IdTermin = tempTermin.Id;
      }
      ;
      this.http
        .post<Termin>(url, tempTermin)
        .subscribe(res => {
          this.myTermin = res;
          console.log('Termin ' + this.myTermin.Id + ' wurde mutiert.');
          myIdMaster = this.myTermin.Id;
          if (WiederholungenVorhanden) {
            let WKok = HandleWiederholungen(this.http);
            console.log('Wiederholungstermine mit IdMaster = ' + this.myTermin.Id + ' erstellt.');
          }
          ;
          this.flagDatenGespeichert = true;
          //this.router.navigate(["gruppen/edit/" + this.myTermin.IdGruppe]);
        }, error => console.log(error));
    } else {  // neuen Termin erstellen
      this.http
        .put<Termin>(url, tempTermin)
        .subscribe(res => {
          var q = res;
          console.log('Termin ' + q.Id + ' erstellt.');
          myIdMaster = q.Id;
          if (WiederholungenVorhanden) {
            let WKok = HandleWiederholungen(this.http);
            console.log('Wiederholungstermine mit IdMaster = ' + q.Id + ' erstellt.');

            // zum Schluss die IdTermin vom "Master"-Termin aktualisieren
            q.IdTermin = q.Id;
            this.http
              .post<Termin>(url, q)
              .subscribe(res => {
                q = res;
                console.log('Termin ' + q.Id + ' wurde mit IdTermin ' + q.Id + ' aktualisiert.');
              }, error => console.log(error));
          }
          ;
          this.flagDatenGespeichert = true;
        }, error => console.log(error));
    }
  }

  createForm() {
    //this.InitFormFields();
    this.onShowDataJson('');
  }

  updateForm() {
    if (this.editMode) {
      this.form.setValue({
        DatumBeginn: this.aktTerminDatBeginn,
        DatumEnde: this.aktTerminDatEnde,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: ((this.aktTerminDatBeginn.getHours() < 10 ? '0' : '') + this.aktTerminDatBeginn.getHours()) + ':'
          + ((this.aktTerminDatBeginn.getMinutes() < 10 ? '0' : '') + this.aktTerminDatBeginn.getMinutes()),
        ZeitEnde: ((this.aktTerminDatEnde.getHours() < 10 ? '0' : '') + this.aktTerminDatEnde.getHours()) + ':'
          + ((this.aktTerminDatEnde.getMinutes() < 10 ? '0' : '') + this.aktTerminDatEnde.getMinutes()),
        AnzWiederholungen: 0,
        MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
        IdGruppe: this.myTermin.IdGruppe,
        IdTeilnehmer: this.myTermin.IdTeilnehmer,
        IdAktivitaet: this.myTermin.IdAktivitaet,
        Hinweis: this.myTermin.Hinweis || ''
      });
    } else {
      let aDate = new Date();
      aDate = moment(aDate).add(1, 'hours').toDate();  // zur aktuellen Uhrzeit ein Stunde dazu rechnen
      this.form.setValue({
        DatumBeginn: this.myTermin.DatumBeginn,
        DatumEnde: this.myTermin.DatumBeginn,
        GanzerTag: this.myTermin.GanzerTag,
        ZeitBeginn: [new Date().getHours() + ':00'],
        ZeitEnde: [aDate.getHours().toString(10) + ':00'],
        AnzWiederholungen: 0,
        MoWH: false, DiWH: false, MiWH: false, DoWH: false, FrWH: false, SaWH: false, SoWH: false,
        IdGruppe: this.myTermin.IdGruppe,
        IdTeilnehmer: '',
        IdAktivitaet: '',
        Hinweis: ''
      });
    }
  }

  onShowDataJson($element) {

    function gotoAnchor() {
      setTimeout(function () {
        let element = document.getElementById($element);
        element.scrollIntoView({behavior: 'smooth', block: 'nearest'});
      }, 0);
    }

    function gobackToTop() {
      setTimeout(function () {
        let element = document.getElementById($element);
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }, 0);
    }

    this.showDataJson = !this.showDataJson;
    if (this.showDataJson) {
      this.showDataJsonTitle = 'Debug-Info';
      this.showDebugInfoBtnClass = 'btn btn-sm btn-warning mybtn mybtnDebugInfo';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-up';
      if ($element != '') {
        gotoAnchor();
      }
    } else {
      this.showDataJsonTitle = 'Debug-Info';
      this.showDebugInfoBtnClass = 'btn btn-sm btn-primary mybtn mybtnDebugInfo';
      this.showDataJsonBtnIcon = 'fas fa-arrow-circle-down';
      if ($element != '') {
        gobackToTop();
      }
    }
  }


}
