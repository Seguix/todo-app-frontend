import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ApiResponse } from "../models/api-response.model";
import { CreateTaskInput, Task, UpdateTaskInput } from "../models/task.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";

@Injectable({ providedIn: "root" })
export class TaskApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    list(): Observable<Task[]> {
        return this.http
            .get<ApiResponse<Task[]>>(`${this.baseUrl}/tasks`)
            .pipe(map((res) => res.data));
    }

    create(input: CreateTaskInput): Observable<Task> {
        return this.http
            .post<ApiResponse<Task>>(`${this.baseUrl}/tasks`, input)
            .pipe(map((res) => res.data));
    }

    update(id: string, patch: UpdateTaskInput): Observable<Task> {
        return this.http
            .put<ApiResponse<Task>>(`${this.baseUrl}/tasks/${id}`, patch)
            .pipe(map((res) => res.data));
    }

    remove(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
    }
}
