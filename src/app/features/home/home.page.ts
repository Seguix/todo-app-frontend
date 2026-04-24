import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

@Component({
    selector: "app-home-page",
    standalone: true,
    template: `
        <section class="home-placeholder">
            <h1>Home</h1>
            <p>Placeholder — se implementa en los Pasos 5 y 6.</p>
            <p>Sesión actual: {{ authService.currentUser?.email ?? "ninguna" }}</p>
            <button type="button" (click)="logout()">Cerrar sesión</button>
        </section>
    `,
    styles: [`
        .home-placeholder {
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
        }
    `]
})
export class HomePageComponent {
    readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    logout(): void {
        this.authService.clearSession();
        this.router.navigate(["/login"]);
    }
}
