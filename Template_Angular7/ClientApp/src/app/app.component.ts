import {Component, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, Subscription} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {GlobalVariables} from "./global.variables";
import { Meta } from '@angular/platform-browser';
import { AuthenticationService } from './_services';
import { Router} from "@angular/router";
import { AppUser} from "@app/interface/appuser";
import {error} from "selenium-webdriver";
import ElementNotSelectableError = error.ElementNotSelectableError;
import {InmemorydataService} from '@app/services/inmemorydata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  currentUser: AppUser;
  title = 'app';
  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  currentUserSubscription: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private meta: Meta,
              private breakpointObserver: BreakpointObserver,
              public globals: GlobalVariables,
              private dataService: InmemorydataService) {

    //this.authenticationService.currentUser.subscribe(x => globals.logged_in_User = x);

    this.globals.logged_in_User = <AppUser>{};
    this.currentUser = <AppUser>{};

    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.globals.logged_in_User = user;
        this.dataService.getData(this.globals.logged_in_User.id);
      }
      else {
        this.globals.logged_in_User.id = 999999;
      };
    });

    this.meta.addTags([
      {name: 'viewport', content: 'initial-scale=1.0, user-scalable=no'}

    ]);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.globals.bp_isSmScreen = this.breakpointObserver.isMatched(Breakpoints.Handset);
    this.globals.bp_isSmScrPrt = this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
    this.globals.bp_isMidScreen = this.breakpointObserver.isMatched(Breakpoints.Tablet);
    this.globals.bp_isWideScreen = this.breakpointObserver.isMatched(Breakpoints.Web);
    this.globals.bp_isMidOrWideScreen = (this.globals.bp_isMidScreen || this.globals.bp_isWideScreen);

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      console.log('event: ', evt)
      this.globals.bp_isSmScreen = this.breakpointObserver.isMatched(Breakpoints.Handset);
      this.globals.bp_isSmScrPrt = this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait);
      this.globals.bp_isMidScreen = this.breakpointObserver.isMatched(Breakpoints.Tablet);
      this.globals.bp_isWideScreen = this.breakpointObserver.isMatched(Breakpoints.Web);
      this.globals.bp_isMidOrWideScreen = (this.globals.bp_isMidScreen || this.globals.bp_isWideScreen);
    });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe()
  }
}

