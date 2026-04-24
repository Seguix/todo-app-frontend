import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
    catchError, map, Observable, of, throwError
} from "rxjs";

import { ApiResponse } from "../models/api-response.model";
import { User } from "../models/user.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";

@Injectable({ providedIn: "root" })
export class UserApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    findByEmail(email: string): Observable<User | null> {
        const params = new HttpParams().set("email", email);
        return this.http
            .get<ApiResponse<User | null>>(`${this.baseUrl}/users`, { params })
            .pipe(
                map((res) => res.data),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 404) {
                        return of(null);
                    }
                    return throwError(() => error);
                })
            );
    }

    create(email: string): Observable<User> {
        return this.http
            .post<ApiResponse<User>>(`${this.baseUrl}/users`, { email })
            .pipe(map((res) => res.data));
    }
}
