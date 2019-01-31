import { Component } from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {AuthenticationService, UserService} from "@app/_services";
import {AppUser} from "@app/interface/appuser";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})

export class NavMenuComponent {
  currentUser: AppUser;
  currentUserSubscription: Subscription;
  isCollapsed = true;

  //constructor( public nav: NavbarService ) {}
  constructor(
    public nav: NavbarService,
    private authenticationService: AuthenticationService,
    private router: Router)
  {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  collapse() {
    this.isCollapsed = true;
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
