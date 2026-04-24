import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subject, throwError } from "rxjs";

import { Task } from "../../../core/models/task.model";
import { TaskApiService } from "../../../core/services/task-api.service";
import { TasksStore } from "./tasks.store";

describe("TasksStore", () => {
    let store: TasksStore;
    let taskApiSpy: jasmine.SpyObj<TaskApiService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    const taskA: Task = {
        id: "a",
        title: "A",
        description: "first",
        completed: false,
        createdAt: "2026-01-01T00:00:00.000Z",
        userId: "u1"
    };
    const taskB: Task = {
        id: "b",
        title: "B",
        description: "second",
        completed: false,
        createdAt: "2026-01-02T00:00:00.000Z",
        userId: "u1"
    };

    beforeEach(() => {
        taskApiSpy = jasmine.createSpyObj<TaskApiService>("TaskApiService", ["list", "create", "update", "remove"]);
        snackBarSpy = jasmine.createSpyObj<MatSnackBar>("MatSnackBar", ["open"]);
        TestBed.configureTestingModule({
            providers: [
                TasksStore,
                { provide: TaskApiService, useValue: taskApiSpy },
                { provide: MatSnackBar, useValue: snackBarSpy }
            ]
        });
        store = TestBed.inject(TasksStore);
    });

    it("load sets sorted tasks and clears loading", () => {
        const list$ = new Subject<Task[]>();
        taskApiSpy.list.and.returnValue(list$.asObservable());

        store.load();
        expect(store.loading()).toBeTrue();

        list$.next([taskA, taskB]);
        list$.complete();

        expect(store.loading()).toBeFalse();
        expect(store.tasks().map((t) => t.id)).toEqual(["b", "a"]);
    });

    it("load sets error and clears loading on failure", () => {
        taskApiSpy.list.and.returnValue(throwError(() => new Error("boom")));

        store.load();

        expect(store.loading()).toBeFalse();
        expect(store.error()).toBe("No se pudieron cargar las tareas.");
    });

    it("add rolls back on create failure", () => {
        taskApiSpy.create.and.returnValue(throwError(() => new Error("fail create")));

        store.add({ title: "Nueva", description: "x" });

        expect(store.tasks()).toEqual([]);
        expect(store.error()).toBe("No se pudo crear la tarea.");
    });

    it("edit updates task with API response", () => {
        taskApiSpy.list.and.returnValue(new Subject<Task[]>().asObservable());
        taskApiSpy.update.and.returnValue(new Subject<Task>().asObservable());

        // seed by direct load success
        const seed$ = new Subject<Task[]>();
        taskApiSpy.list.and.returnValue(seed$.asObservable());
        store.load();
        seed$.next([taskA]);
        seed$.complete();

        const update$ = new Subject<Task>();
        taskApiSpy.update.and.returnValue(update$.asObservable());
        store.edit("a", { completed: true });
        update$.next({ ...taskA, completed: true });
        update$.complete();

        expect(store.tasks()[0].completed).toBeTrue();
    });

    it("remove rolls back on delete failure", () => {
        const seed$ = new Subject<Task[]>();
        taskApiSpy.list.and.returnValue(seed$.asObservable());
        store.load();
        seed$.next([taskA]);
        seed$.complete();

        taskApiSpy.remove.and.returnValue(throwError(() => new Error("fail delete")));
        store.remove("a");

        expect(store.tasks()).toEqual([taskA]);
        expect(store.error()).toBe("No se pudo eliminar la tarea.");
    });
});
