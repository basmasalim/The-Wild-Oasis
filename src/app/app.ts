import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('The-Wild-Oasis');

  toggleDarkMode() {
    const el = document.querySelector('html');
    el?.classList.toggle('app-dark');
  }
}
