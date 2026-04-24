import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "../models/user.model";

const STORAGE_KEY = "todo-app.user";

function restoreSession(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly userSubject = new BehaviorSubject<User | null>(restoreSession());

    readonly currentUser$: Observable<User | null> = this.userSubject.asObservable();

    get currentUser(): User | null {
        return this.userSubject.value;
    }

    isAuthenticated(): boolean {
        return this.userSubject.value !== null;
    }

    setSession(user: User): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.userSubject.next(user);
    }

    clearSession(): void {
        localStorage.removeItem(STORAGE_KEY);
        this.userSubject.next(null);
    }
}
