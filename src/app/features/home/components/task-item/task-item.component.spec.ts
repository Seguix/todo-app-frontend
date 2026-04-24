import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { of } from "rxjs";

import { Task } from "../../../../core/models/task.model";
import { TaskItemComponent } from "./task-item.component";

describe("TaskItemComponent", () => {
    let fixture: ComponentFixture<TaskItemComponent>;
    let component: TaskItemComponent;
    let dialogOpenSpy: jasmine.Spy;

    const task: Task = {
        id: "task-1",
        title: "Tarea demo",
        description: "Descripcion",
        completed: false,
        createdAt: "2026-04-24T02:00:00.000Z",
        userId: "user-1"
    };

    beforeEach(async () => {
        const dialogMock = {
            open: () => ({ afterClosed: () => of(true) })
        };

        await TestBed.configureTestingModule({
            imports: [TaskItemComponent],
            providers: [{ provide: MatDialog, useValue: dialogMock }]
        }).compileComponents();

        fixture = TestBed.createComponent(TaskItemComponent);
        component = fixture.componentInstance;
        component.task = task;
        dialogOpenSpy = spyOn(TestBed.inject(MatDialog), "open").and.callThrough();
        fixture.detectChanges();
    });

    it("emite toggle cuando cambia el checkbox", () => {
        const toggleSpy = spyOn(component.toggle, "emit");
        const checkbox: HTMLInputElement | null = fixture.nativeElement.querySelector("input[type='checkbox']");

        checkbox?.click();

        expect(toggleSpy).toHaveBeenCalledWith(task);
    });

    it("al eliminar abre confirmacion y emite remove cuando confirma", () => {
        const removeSpy = spyOn(component.remove, "emit");

        component.confirmRemove();

        expect(dialogOpenSpy).toHaveBeenCalled();
        expect(removeSpy).toHaveBeenCalledWith(task.id);
    });
});
