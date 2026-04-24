import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";

import { User } from "../../core/models/user.model";
import { AuthService } from "../../core/services/auth.service";
import { API_BASE_URL } from "../../core/tokens/api-base-url.token";
import { LoginPageComponent } from "./login.page";

class MatDialogMock {
    result = true;

    open(): { afterClosed: () => Observable<boolean> } {
        return {
            afterClosed: () => of(this.result)
        };
    }
}

describe("LoginPageComponent", () => {
    const baseUrl = "http://test.api";
    let httpMock: HttpTestingController;
    let authService: AuthService;
    let dialogMock: MatDialogMock;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj<Router>("Router", ["navigate"]);
        routerSpy.navigate.and.resolveTo(true);

        await TestBed.configureTestingModule({
            imports: [LoginPageComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: API_BASE_URL, useValue: baseUrl },
                { provide: Router, useValue: routerSpy },
                { provide: MatDialog, useClass: MatDialogMock }
            ]
        }).compileComponents();

        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
        dialogMock = TestBed.inject(MatDialog) as unknown as MatDialogMock;
        authService.clearSession();
    });

    afterEach(() => {
        httpMock.verify();
        authService.clearSession();
    });

    it("navega al home cuando el usuario existe", () => {
        const fixture = TestBed.createComponent(LoginPageComponent);
        const component = fixture.componentInstance;
        const existingUser: User = {
            id: "u1",
            email: "existing@example.com",
            createdAt: "2026-01-01T00:00:00Z"
        };

        component.emailControl.setValue("existing@example.com");
        component.onSubmit();

        const req = httpMock.expectOne(`${baseUrl}/users?email=existing@example.com`);
        expect(req.request.method).toBe("GET");
        req.flush({ data: existingUser });

        expect(authService.currentUser).toEqual(existingUser);
        expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);
    });

    it("crea usuario y navega al home cuando no existe y confirma dialogo", () => {
        const fixture = TestBed.createComponent(LoginPageComponent);
        const component = fixture.componentInstance;
        const createdUser: User = {
            id: "u2",
            email: "new@example.com",
            createdAt: "2026-01-02T00:00:00Z"
        };
        dialogMock.result = true;

        component.emailControl.setValue("new@example.com");
        component.onSubmit();

        const findReq = httpMock.expectOne(`${baseUrl}/users?email=new@example.com`);
        expect(findReq.request.method).toBe("GET");
        findReq.flush({ data: null });

        const createReq = httpMock.expectOne(`${baseUrl}/users`);
        expect(createReq.request.method).toBe("POST");
        expect(createReq.request.body).toEqual({ email: "new@example.com" });
        createReq.flush({ data: createdUser });

        expect(authService.currentUser).toEqual(createdUser);
        expect(routerSpy.navigate).toHaveBeenCalledWith(["/home"]);
    });

    it("no crea usuario ni navega cuando no existe y cancela dialogo", () => {
        const fixture = TestBed.createComponent(LoginPageComponent);
        const component = fixture.componentInstance;
        dialogMock.result = false;

        component.emailControl.setValue("cancel@example.com");
        component.onSubmit();

        const findReq = httpMock.expectOne(`${baseUrl}/users?email=cancel@example.com`);
        expect(findReq.request.method).toBe("GET");
        findReq.flush({ data: null });

        const createRequests = httpMock.match((req) => req.method === "POST" && req.url === `${baseUrl}/users`);
        expect(createRequests.length).toBe(0);
        expect(authService.currentUser).toBeNull();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
});
