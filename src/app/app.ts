import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Loading } from './core/services/loading/loading';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, ProgressSpinner, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('The-Wild-Oasis');


  constructor(private loadingService: Loading) { }

  get loading$() {
    return this.loadingService.loading$;
  }


}
