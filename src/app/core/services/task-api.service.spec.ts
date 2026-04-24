import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Task } from "../models/task.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";
import { TaskApiService } from "./task-api.service";

describe("TaskApiService", () => {
    const baseUrl = "http://test.api";
    let service: TaskApiService;
    let httpMock: HttpTestingController;

    const sampleTask: Task = {
        id: "t1",
        title: "Estudiar",
        description: "Angular",
        completed: false,
        createdAt: "2026-01-01T00:00:00Z",
        userId: "u1"
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: API_BASE_URL, useValue: baseUrl }
            ]
        });
        service = TestBed.inject(TaskApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it("list(): GETs /tasks and unwraps data", () => {
        let tasks: Task[] | undefined;

        service.list().subscribe((t) => {
            tasks = t;
        });

        const req = httpMock.expectOne(`${baseUrl}/tasks`);
        expect(req.request.method).toBe("GET");
        req.flush({ data: [sampleTask] });

        expect(tasks).toEqual([sampleTask]);
    });

    it("create(): POSTs /tasks with input and unwraps data", () => {
        let created: Task | undefined;

        service.create({ title: "Nueva", description: "desc" }).subscribe((t) => {
            created = t;
        });

        const req = httpMock.expectOne(`${baseUrl}/tasks`);
        expect(req.request.method).toBe("POST");
        expect(req.request.body).toEqual({ title: "Nueva", description: "desc" });
        req.flush({ data: sampleTask });

        expect(created).toEqual(sampleTask);
    });

    it("update(): PUTs /tasks/:id with patch and unwraps data", () => {
        let updated: Task | undefined;

        service.update("t1", { completed: true }).subscribe((t) => {
            updated = t;
        });

        const req = httpMock.expectOne(`${baseUrl}/tasks/t1`);
        expect(req.request.method).toBe("PUT");
        expect(req.request.body).toEqual({ completed: true });
        req.flush({ data: { ...sampleTask, completed: true } });

        expect(updated?.completed).toBe(true);
    });

    it("remove(): DELETEs /tasks/:id and completes on 204", () => {
        let completed = false;

        service.remove("t1").subscribe({
            complete: () => {
                completed = true;
            }
        });

        const req = httpMock.expectOne(`${baseUrl}/tasks/t1`);
        expect(req.request.method).toBe("DELETE");
        req.flush(null, { status: 204, statusText: "No Content" });

        expect(completed).toBe(true);
    });
});
