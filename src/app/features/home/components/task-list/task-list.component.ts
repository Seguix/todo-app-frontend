import {
    CommonModule
} from "@angular/common";
import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { Task, UpdateTaskInput } from "../../../../core/models/task.model";
import { EmptyStateComponent } from "../../../../shared/ui/empty-state/empty-state.component";
import { TaskItemComponent } from "../task-item/task-item.component";

@Component({
    selector: "app-task-list",
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule, EmptyStateComponent, TaskItemComponent],
    templateUrl: "./task-list.component.html",
    styleUrl: "./task-list.component.scss"
})
export class TaskListComponent {
    private readonly trackPrefix = "";

    @Input({ required: true }) tasks: Task[] = [];
    @Input() loading = false;
    @Input() error: string | null = null;

    @Output() toggleTask = new EventEmitter<Task>();
    @Output() editTask = new EventEmitter<{ id: string; patch: UpdateTaskInput }>();
    @Output() removeTask = new EventEmitter<string>();

    trackById(_: number, task: Task): string {
        return `${this.trackPrefix}${task.id}`;
    }
}
