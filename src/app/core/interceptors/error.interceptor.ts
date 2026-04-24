import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, throwError } from "rxjs";

function resolveMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
        return "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    const apiMessage = (error.error as { message?: string } | null)?.message;
    if (apiMessage) {
        return apiMessage;
    }
    return `Ocurrió un error (${error.status}). Intenta nuevamente.`;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const message = resolveMessage(error);
            snackBar.open(message, "Cerrar", {
                duration: 5000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ["app-snackbar-error"]
            });
            return throwError(() => error);
        })
    );
};
