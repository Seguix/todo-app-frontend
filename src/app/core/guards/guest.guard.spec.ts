import { TestBed } from "@angular/core/testing";
import { Router, UrlTree } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { guestGuard } from "./guest.guard";

describe("guestGuard", () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    const redirectTree = {} as UrlTree;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj<AuthService>("AuthService", ["isAuthenticated"]);
        routerSpy = jasmine.createSpyObj<Router>("Router", ["createUrlTree"]);
        routerSpy.createUrlTree.and.returnValue(redirectTree);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });
    });

    it("returns true when user is not authenticated", () => {
        authServiceSpy.isAuthenticated.and.returnValue(false);

        const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

        expect(result).toBeTrue();
    });

    it("redirects to /home when user is authenticated", () => {
        authServiceSpy.isAuthenticated.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(["/home"]);
        expect(result).toBe(redirectTree);
    });
});
