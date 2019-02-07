import {Component, OnInit} from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {AuthenticationService, UserService} from "@app/_services";
import {AppUser} from "@app/interface/appuser";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {GlobalVariables} from "@app/global.variables";
import {environment} from "@environments/environment";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent implements OnInit{
  currentUser: AppUser;
  AppUser;
  currentUserID: number;
  currentUserSubscription: Subscription;
  isCollapsed = true;
  version: string;

  //constructor( public nav: NavbarService ) {}
  constructor(
    public nav: NavbarService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public globals: GlobalVariables)
  {

    //this.globals.logged_in_User = <AppUser>{};
    //this.globals.logged_in_User.id = 9999999; // test*/
  }

  ngOnInit() {
    this.version = environment.appversion;
  }

  collapse() {
    this.isCollapsed = true;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.collapse();
    this.globals.logged_in_User.id = 9999999;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
