import {Component, OnDestroy, OnInit} from "@angular/core";
import {AppUser} from "@app/interface/appuser";
import {Subscription} from "rxjs";
import {AuthenticationService, UserService} from "@app/_services";
import {first} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: "about",
  templateUrl: "./about.component.html"
})

export class AboutComponent implements OnInit, OnDestroy {
  title = "About";
  currentUser: AppUser;
  currentUserSubscription: Subscription;
  users: AppUser[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router)
  {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers();
    });
  }

  private loadAllUsers() {
    this.userService.getAll()
      .pipe(first())
      .subscribe(users => {
        this.users = users;

    },
        error => this.router.navigate(['/login']));

  }
}
