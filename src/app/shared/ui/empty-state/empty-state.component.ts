import {
    Component, EventEmitter, Input, Output
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-empty-state",
    standalone: true,
    imports: [MatIconModule, MatButtonModule],
    template: `
        <section class="empty-state">
            <mat-icon>{{ icon }}</mat-icon>
            <h3>{{ title }}</h3>
            @if (message) {
                <p>{{ message }}</p>
            }
            @if (ctaLabel) {
                <button mat-stroked-button color="primary" type="button" (click)="ctaClick.emit()">
                    {{ ctaLabel }}
                </button>
            }
        </section>
    `,
    styleUrl: "./empty-state.component.scss"
})
export class EmptyStateComponent {
    @Input() icon = "checklist";
    @Input() title = "No hay datos";
    @Input() message = "";
    @Input() ctaLabel?: string;

    @Output() ctaClick = new EventEmitter<void>();
}
