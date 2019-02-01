import { Component } from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {AuthenticationService, UserService} from "@app/_services";
import {AppUser} from "@app/interface/appuser";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {GlobalVariables} from "@app/global.variables";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent {
  currentUser: AppUser;
  AppUser;
  currentUserID: number;
  currentUserSubscription: Subscription;
  isCollapsed = true;

  //constructor( public nav: NavbarService ) {}
  constructor(
    public nav: NavbarService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public globals: GlobalVariables)
  {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.currentUserID = user.id;
    });
  }

  collapse() {
    this.isCollapsed = true;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.collapse();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
