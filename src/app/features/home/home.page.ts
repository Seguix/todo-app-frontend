import { Component, inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router } from "@angular/router";

import { Task, UpdateTaskInput } from "../../core/models/task.model";
import { AuthService } from "../../core/services/auth.service";
import { TaskFormComponent } from "./components/task-form/task-form.component";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TasksStore } from "./state/tasks.store";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [MatToolbarModule, MatButtonModule, TaskFormComponent, TaskListComponent],
    providers: [TasksStore],
    templateUrl: "./home.page.html",
    styleUrl: "./home.page.scss"
})
export class HomePageComponent implements OnInit {
    readonly authService = inject(AuthService);
    readonly store = inject(TasksStore);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.store.load();
    }

    logout(): void {
        this.authService.clearSession();
        this.router.navigate(["/login"]);
    }

    onEditTask(event: { id: string; patch: UpdateTaskInput }): void {
        this.store.edit(event.id, event.patch);
    }

    onToggleTask(task: Task): void {
        this.store.toggle(task);
    }
}
