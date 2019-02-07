import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { AppUser } from "@app/interface/appuser";
import {GlobalVariables} from "@app/global.variables";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<AppUser>;
    public currentUser: Observable<AppUser>;

    constructor(private http: HttpClient,
                public globals: GlobalVariables) {
        this.currentUserSubject = new BehaviorSubject<AppUser>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): AppUser {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {

      return this.http.post<any>(`${environment.apiUrl}/appusers/authenticate`, { username, password })
      /*return this.http.post<any>(`http://www.razorflights.com/appusers/authenticate`, { username, password })*/
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.globals.logged_in_User.id = user.id;
                    this.globals.logged_in_User.firstName = user.firstName;
                    this.globals.logged_in_User.lastName = user.lastName;
                    this.globals.logged_in_User.email = user.email;
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
