import { Component, EventEmitter, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { CreateTaskInput } from "../../../../core/models/task.model";

@Component({
    selector: "app-task-form",
    standalone: true,
    imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: "./task-form.component.html",
    styleUrl: "./task-form.component.scss"
})
export class TaskFormComponent {
    @Output() submitTask = new EventEmitter<CreateTaskInput>();

    readonly titleControl = new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)]
    });
    readonly descriptionControl = new FormControl("", {
        nonNullable: true,
        validators: [Validators.maxLength(500)]
    });

    onSubmit(event?: SubmitEvent): void {
        event?.preventDefault();

        if (this.titleControl.invalid) {
            this.titleControl.markAsTouched();
            return;
        }

        this.submitTask.emit({
            title: this.titleControl.value.trim(),
            description: this.descriptionControl.value.trim()
        });

        this.titleControl.reset("");
        this.descriptionControl.reset("");
    }
}
