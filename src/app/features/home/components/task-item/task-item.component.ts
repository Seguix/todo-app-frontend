import { DatePipe } from "@angular/common";
import {
    Component, EventEmitter, inject,
    Input, Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { filter } from "rxjs";

import { Task, UpdateTaskInput } from "../../../../core/models/task.model";
import { ConfirmDialogComponent } from "../../../../shared/ui/confirm-dialog/confirm-dialog.component";
import { TaskEditDialogComponent } from "../task-edit-dialog/task-edit-dialog.component";

@Component({
    selector: "app-task-item",
    standalone: true,
    imports: [MatCardModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatChipsModule, DatePipe],
    templateUrl: "./task-item.component.html",
    styleUrl: "./task-item.component.scss"
})
export class TaskItemComponent {
    private readonly dialog = inject(MatDialog);

    @Input({ required: true }) task!: Task;

    @Output() toggle = new EventEmitter<Task>();
    @Output() edit = new EventEmitter<{ id: string; patch: UpdateTaskInput }>();
    @Output() remove = new EventEmitter<string>();

    openEdit(): void {
        this.dialog.open(TaskEditDialogComponent, { data: { task: this.task }, width: "520px" })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe((patch: UpdateTaskInput) => {
                this.edit.emit({ id: this.task.id, patch });
            });
    }

    confirmRemove(): void {
        this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: "Eliminar tarea",
                message: "Esta accion no se puede deshacer.",
                confirmLabel: "Eliminar",
                cancelLabel: "Cancelar"
            }
        })
            .afterClosed()
            .pipe(filter(Boolean))
            .subscribe(() => {
                this.remove.emit(this.task.id);
            });
    }
}
