import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { User } from "../models/user.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";
import { UserApiService } from "./user-api.service";

describe("UserApiService", () => {
    const baseUrl = "http://test.api";
    let service: UserApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: API_BASE_URL, useValue: baseUrl }
            ]
        });
        service = TestBed.inject(UserApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    describe("findByEmail", () => {
        it("returns the user when the API responds with data", () => {
            const mockUser: User = {
                id: "1",
                email: "a@a.com",
                createdAt: "2026-01-01T00:00:00Z"
            };
            let result: User | null | undefined;

            service.findByEmail("a@a.com").subscribe((user) => {
                result = user;
            });

            const req = httpMock.expectOne(`${baseUrl}/users?email=a@a.com`);
            expect(req.request.method).toBe("GET");
            req.flush({ data: mockUser });

            expect(result).toEqual(mockUser);
        });

        it("returns null when the API responds with data: null (user not found)", () => {
            let result: User | null | undefined;

            service.findByEmail("nobody@example.com").subscribe((user) => {
                result = user;
            });

            httpMock
                .expectOne(`${baseUrl}/users?email=nobody@example.com`)
                .flush({ data: null });

            expect(result).toBeNull();
        });

        it("returns null when the API responds with 404", () => {
            let result: User | null | undefined;

            service.findByEmail("nobody@example.com").subscribe((user) => {
                result = user;
            });

            httpMock
                .expectOne(`${baseUrl}/users?email=nobody@example.com`)
                .flush(null, { status: 404, statusText: "Not Found" });

            expect(result).toBeNull();
        });

        it("re-throws on non-404 errors", () => {
            let errorStatus: number | undefined;

            service.findByEmail("x@x.com").subscribe({
                next: () => fail("should not emit a value on server error"),
                error: (err) => {
                    errorStatus = err.status;
                }
            });

            httpMock
                .expectOne(`${baseUrl}/users?email=x@x.com`)
                .flush(null, { status: 500, statusText: "Server Error" });

            expect(errorStatus).toBe(500);
        });
    });

    describe("create", () => {
        it("posts the email and returns the created user", () => {
            const mockUser: User = {
                id: "2",
                email: "b@b.com",
                createdAt: "2026-01-02T00:00:00Z"
            };
            let result: User | undefined;

            service.create("b@b.com").subscribe((user) => {
                result = user;
            });

            const req = httpMock.expectOne(`${baseUrl}/users`);
            expect(req.request.method).toBe("POST");
            expect(req.request.body).toEqual({ email: "b@b.com" });
            req.flush({ data: mockUser });

            expect(result).toEqual(mockUser);
        });
    });
});
