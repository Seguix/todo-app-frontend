import { Routes } from "@angular/router";

import { authGuard } from "./core/guards/auth.guard";
import { guestGuard } from "./core/guards/guest.guard";

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "login",
        canActivate: [guestGuard],
        loadComponent: () => import("./features/login/login.page").then((m) => m.LoginPageComponent)
    },
    {
        path: "home",
        canActivate: [authGuard],
        loadComponent: () => import("./features/home/home.page").then((m) => m.HomePageComponent)
    },
    {
        path: "**",
        redirectTo: "/home"
    }
];
