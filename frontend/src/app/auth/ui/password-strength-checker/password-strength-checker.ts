import {Component, computed, input} from '@angular/core';
import {ValidationError} from "@angular/forms/signals";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-password-strength-checker',
    imports: [
        MatIcon
    ],
  templateUrl: './password-strength-checker.html',
  styleUrl: './password-strength-checker.css',
})
export class PasswordStrengthChecker {
    currentErrors = input.required<ValidationError.WithField[]>();
    errorsToDisplay = input.required<ValidationError.WithField[]>();

    supportedErrorKinds = computed(() => {
        return this.errorsToDisplay().map(e => e.kind)
    })

    currentSupportedErrors = computed(() => {
        return this.currentErrors().filter(e => this.supportedErrorKinds().includes(e.kind))
    })

    hasError(kind: string): boolean {
        return this.currentSupportedErrors().some((e: any) => e.kind === kind);
    }

    getMessageForError(kind: string): string{
        return this.errorsToDisplay().find(e => e.kind === kind)?.message ?? `Default error message (no message specified in errorsToDisplay for error kind: '${kind}'`;
    }
}
