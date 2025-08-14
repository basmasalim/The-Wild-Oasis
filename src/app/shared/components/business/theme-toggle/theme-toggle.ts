import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-theme-toggle',
  imports: [FormsModule, ToggleButtonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  isDarkMode = true;

  ngOnInit(): void {
    this.loadThemePreference();
  }

  toggleTheme(): void {
    this.applyTheme();
    this.saveThemePreference();
  }

  private applyTheme(): void {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('app-dark');
    } else {
      html.classList.remove('app-dark');
    }
  }

  private loadThemePreference(): void {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      this.isDarkMode = savedMode === 'true';
      this.applyTheme();
    }
  }

  private saveThemePreference(): void {
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}
