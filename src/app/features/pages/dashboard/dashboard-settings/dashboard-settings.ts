import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard-settings.html',
  styleUrl: './dashboard-settings.scss',
})
export class DashboardSettings implements OnInit {
  private readonly fb = inject(FormBuilder);
  settingsForm!: FormGroup;

  ngOnInit() {
    this.settingInit();
    // this.minMaxvalidator();
  }

  settingInit(): void {
    this.settingsForm = this.fb.group({
      minNights: [1, [Validators.required, Validators.min(1)]],
      maxNights: [30, [Validators.required, Validators.min(1)]],
      maxGuests: [48, [Validators.required, Validators.min(1)]],
      breakfastPrice: [1, [Validators.required, Validators.min(0)]],
    });
  }

  // minMaxvalidator(): void {
  //   this.settingsForm.get('minNights')?.valueChanges.subscribe(() => {
  //     this.settingsForm.get('maxNights')?.updateValueAndValidity();
  //   });
  // }

  onSubmit() {
    if (this.settingsForm.valid) {
      console.log('Settings updated:', this.settingsForm.value);
      // Add your save logic here
    }
  }
}
