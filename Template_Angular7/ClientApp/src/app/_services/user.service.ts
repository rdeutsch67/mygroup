import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { AppUser } from "@app/interface/appuser";

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<AppUser[]>(`${environment.apiUrl}/appusers`);
    }

    getById(id: number) {
        return this.http.get(`${environment.apiUrl}/appusers/${id}`);
    }

    register(user: AppUser) {
        return this.http.post(`${environment.apiUrl}/appusers/register`, user);
    }

    update(user: AppUser) {
        return this.http.put(`${environment.apiUrl}/appusers/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/appusers/${id}`);
    }
}
