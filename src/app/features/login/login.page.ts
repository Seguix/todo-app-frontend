import { Component, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import {
    EMPTY, finalize, of, switchMap
} from "rxjs";

import { AuthService } from "../../core/services/auth.service";
import { UserApiService } from "../../core/services/user-api.service";
import { ConfirmDialogComponent } from "../../shared/ui/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-login-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: "./login.page.html",
    styleUrl: "./login.page.scss"
})
export class LoginPageComponent {
    private readonly userApi = inject(UserApiService);
    private readonly authService = inject(AuthService);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);

    readonly emailControl = new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
    });

    isLoading = false;

    onSubmit(event?: SubmitEvent): void {
        event?.preventDefault();

        if (this.emailControl.invalid || this.isLoading) {
            this.emailControl.markAsTouched();
            return;
        }

        const email = this.emailControl.value.trim().toLowerCase();
        this.isLoading = true;

        this.userApi.findByEmail(email).pipe(
            switchMap((user) => {
                if (user) {
                    return of(user);
                }

                return this.dialog
                    .open(ConfirmDialogComponent, {
                        data: {
                            title: "Crear usuario",
                            message: `No encontramos el email ${email}. Deseas crear este usuario para continuar?`,
                            confirmLabel: "Crear",
                            cancelLabel: "Cancelar"
                        },
                        disableClose: true
                    })
                    .afterClosed()
                    .pipe(
                        switchMap((confirmed) => (confirmed ? this.userApi.create(email) : EMPTY))
                    );
            }),
            finalize(() => {
                this.isLoading = false;
            })
        ).subscribe((user) => {
            this.authService.setSession(user);
            this.router.navigate(["/home"]);
        });
    }
}
