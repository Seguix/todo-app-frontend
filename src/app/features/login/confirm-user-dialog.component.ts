import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

interface ConfirmUserDialogData {
    email: string;
}

@Component({
    selector: "app-confirm-user-dialog",
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>Crear usuario</h2>
        <mat-dialog-content>
            <p>No encontramos el email <strong>{{ data.email }}</strong>.</p>
            <p>Deseas crear este usuario para continuar?</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button mat-button type="button" (click)="onCancel()">Cancelar</button>
            <button mat-flat-button color="primary" type="button" (click)="onConfirm()">Crear</button>
        </mat-dialog-actions>
    `
})
export class ConfirmUserDialogComponent {
    constructor(
        private readonly dialogRef: MatDialogRef<ConfirmUserDialogComponent, boolean>,
        @Inject(MAT_DIALOG_DATA) readonly data: ConfirmUserDialogData
    ) {}

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
