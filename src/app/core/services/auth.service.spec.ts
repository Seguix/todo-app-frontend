import { TestBed } from "@angular/core/testing";

import { User } from "../models/user.model";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
    const storageKey = "todo-app.user";
    const mockUser: User = {
        id: "u-1",
        email: "demo@example.com",
        createdAt: "2026-01-01T00:00:00.000Z"
    };

    beforeEach(() => {
        localStorage.removeItem(storageKey);
        TestBed.configureTestingModule({});
    });

    afterEach(() => {
        localStorage.removeItem(storageKey);
    });

    it("restores session from localStorage", () => {
        localStorage.setItem(storageKey, JSON.stringify(mockUser));
        const service = TestBed.inject(AuthService);

        expect(service.currentUser).toEqual(mockUser);
        expect(service.isAuthenticated()).toBeTrue();
    });

    it("setSession persists the user and emits it", () => {
        const service = TestBed.inject(AuthService);
        let emitted: User | null | undefined;

        service.currentUser$.subscribe((user) => {
            emitted = user;
        });
        service.setSession(mockUser);

        expect(service.currentUser).toEqual(mockUser);
        expect(emitted).toEqual(mockUser);
        expect(localStorage.getItem(storageKey)).toBe(JSON.stringify(mockUser));
    });

    it("clearSession clears localStorage and user state", () => {
        const service = TestBed.inject(AuthService);
        service.setSession(mockUser);

        service.clearSession();

        expect(service.currentUser).toBeNull();
        expect(service.isAuthenticated()).toBeFalse();
        expect(localStorage.getItem(storageKey)).toBeNull();
    });
});
