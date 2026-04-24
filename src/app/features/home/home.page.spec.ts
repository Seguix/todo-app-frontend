import { TestBed } from "@angular/core/testing";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";
import { HomePageComponent } from "./home.page";
import { TasksStore } from "./state/tasks.store";

describe("HomePageComponent", () => {
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let storeSpy: {
        load: jasmine.Spy;
        add: jasmine.Spy;
        edit: jasmine.Spy;
        toggle: jasmine.Spy;
        remove: jasmine.Spy;
        tasks: () => never[];
        loading: () => boolean;
        error: () => null;
    };

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj<AuthService>("AuthService", ["clearSession"], { currentUser: null });
        routerSpy = jasmine.createSpyObj<Router>("Router", ["navigate"]);
        routerSpy.navigate.and.resolveTo(true);
        storeSpy = {
            load: jasmine.createSpy("load"),
            add: jasmine.createSpy("add"),
            edit: jasmine.createSpy("edit"),
            toggle: jasmine.createSpy("toggle"),
            remove: jasmine.createSpy("remove"),
            tasks: () => [],
            loading: () => false,
            error: () => null
        };

        TestBed.configureTestingModule({
            imports: [HomePageComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
                provideNoopAnimations()
            ]
        });
        TestBed.overrideComponent(HomePageComponent, {
            set: {
                providers: [{ provide: TasksStore, useValue: storeSpy as unknown as TasksStore }]
            }
        });
        await TestBed.compileComponents();
    });

    it("loads tasks on init", () => {
        const fixture = TestBed.createComponent(HomePageComponent);
        fixture.detectChanges();

        expect(storeSpy.load).toHaveBeenCalled();
    });

    it("logout clears session and navigates to /login", () => {
        const fixture = TestBed.createComponent(HomePageComponent);
        const component = fixture.componentInstance;

        component.logout();

        expect(authServiceSpy.clearSession).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"]);
    });
});
