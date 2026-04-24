import { Component } from "@angular/core";

@Component({
    selector: "app-login-page",
    standalone: true,
    template: `
        <section class="login-placeholder">
            <h1>Login</h1>
            <p>Placeholder — se implementa en el Paso 4.</p>
        </section>
    `,
    styles: [`
        .login-placeholder {
            padding: 2rem;
        }
    `]
})
export class LoginPageComponent {}
