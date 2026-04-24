import {
    computed, inject, Injectable, Signal, signal
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { CreateTaskInput, Task, UpdateTaskInput } from "../../../core/models/task.model";
import { TaskApiService } from "../../../core/services/task-api.service";

function sortByCreatedAtDesc(tasks: Task[]): Task[] {
    return [...tasks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

@Injectable()
export class TasksStore {
    private readonly taskApi = inject(TaskApiService);
    private readonly snackBar = inject(MatSnackBar);

    private readonly tasksState = signal<Task[]>([]);
    private readonly loadingState = signal(false);
    private readonly errorState = signal<string | null>(null);

    readonly tasks: Signal<Task[]> = computed(() => sortByCreatedAtDesc(this.tasksState()));
    readonly loading: Signal<boolean> = this.loadingState.asReadonly();
    readonly error: Signal<string | null> = this.errorState.asReadonly();

    private notify(message: string): void {
        this.snackBar.open(message, "Cerrar", { duration: 2200 });
    }

    load(): void {
        this.loadingState.set(true);
        this.errorState.set(null);

        this.taskApi.list().subscribe({
            next: (tasks) => {
                this.tasksState.set(tasks);
            },
            error: () => {
                this.errorState.set("No se pudieron cargar las tareas.");
                this.loadingState.set(false);
            },
            complete: () => {
                this.loadingState.set(false);
            }
        });
    }

    add(input: CreateTaskInput): void {
        const previous = this.tasksState();
        const optimistic: Task = {
            id: `temp-${Date.now()}`,
            title: input.title,
            description: input.description ?? "",
            completed: false,
            createdAt: new Date().toISOString(),
            userId: "optimistic"
        };

        this.errorState.set(null);
        this.tasksState.set([optimistic, ...previous]);

        this.taskApi.create(input).subscribe({
            next: (createdTask) => {
                this.tasksState.update((tasks) => tasks.map(
                    (task) => (task.id === optimistic.id ? createdTask : task)
                ));
                this.notify("Tarea agregada.");
            },
            error: () => {
                this.tasksState.set(previous);
                this.errorState.set("No se pudo crear la tarea.");
                this.notify("No se pudo agregar la tarea.");
            }
        });
    }

    toggle(task: Task): void {
        this.edit(task.id, { completed: !task.completed });
    }

    edit(id: string, patch: UpdateTaskInput): void {
        const previous = this.tasksState();

        this.errorState.set(null);
        this.tasksState.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)));

        this.taskApi.update(id, patch).subscribe({
            next: (updatedTask) => {
                this.tasksState.update((tasks) => tasks.map((task) => (task.id === id ? updatedTask : task)));
                if (Object.prototype.hasOwnProperty.call(patch, "completed")) {
                    this.notify(patch.completed ? "Tarea marcada como completada." : "Tarea marcada como pendiente.");
                    return;
                }
                this.notify("Tarea actualizada.");
            },
            error: () => {
                this.tasksState.set(previous);
                this.errorState.set("No se pudo actualizar la tarea.");
                this.notify("No se pudo actualizar la tarea.");
            }
        });
    }

    remove(id: string): void {
        const previous = this.tasksState();

        this.errorState.set(null);
        this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));

        this.taskApi.remove(id).subscribe({
            next: () => {
                this.notify("Tarea eliminada.");
            },
            error: () => {
                this.tasksState.set(previous);
                this.errorState.set("No se pudo eliminar la tarea.");
                this.notify("No se pudo eliminar la tarea.");
            }
        });
    }
}
