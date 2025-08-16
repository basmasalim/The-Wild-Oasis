import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-dialog',
  imports: [DialogModule, ButtonModule, InputTextModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSave = new EventEmitter<void>();

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  save() {
    this.onSave.emit();
    this.closeDialog();
  }
}
