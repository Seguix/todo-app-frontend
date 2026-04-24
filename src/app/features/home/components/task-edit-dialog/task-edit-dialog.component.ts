import { Component, Inject } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA, MatDialogModule, MatDialogRef
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { Task, UpdateTaskInput } from "../../../../core/models/task.model";

interface TaskEditDialogData {
    task: Task;
}

@Component({
    selector: "app-task-edit-dialog",
    standalone: true,
    imports: [MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: "./task-edit-dialog.component.html",
    styleUrl: "./task-edit-dialog.component.scss"
})
export class TaskEditDialogComponent {
    readonly titleControl = new FormControl(this.data.task.title, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)]
    });

    readonly descriptionControl = new FormControl(this.data.task.description ?? "", {
        nonNullable: true,
        validators: [Validators.maxLength(500)]
    });

    constructor(
        private readonly dialogRef: MatDialogRef<TaskEditDialogComponent, UpdateTaskInput | null>,
        @Inject(MAT_DIALOG_DATA) readonly data: TaskEditDialogData
    ) {}

    save(event?: SubmitEvent): void {
        event?.preventDefault();

        if (this.titleControl.invalid || this.descriptionControl.invalid) {
            this.titleControl.markAsTouched();
            this.descriptionControl.markAsTouched();
            return;
        }

        const patch: UpdateTaskInput = {};
        const nextTitle = this.titleControl.value.trim();
        const nextDescription = this.descriptionControl.value.trim();

        if (nextTitle !== this.data.task.title) {
            patch.title = nextTitle;
        }

        if (nextDescription !== this.data.task.description) {
            patch.description = nextDescription;
        }

        this.dialogRef.close(Object.keys(patch).length > 0 ? patch : null);
    }
}
