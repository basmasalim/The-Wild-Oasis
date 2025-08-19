import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-box',
  imports: [],
  templateUrl: './recent-box.html',
  styleUrl: './recent-box.scss'
})
export class RecentBox {

  @Input() icon: string = 'pi pi-briefcase';
  @Input() color: string = 'var(--color-blue-700)';
  @Input() bgColor: string = 'var(--color-blue-100)';
  @Input() label: string = 'Label';
  @Input() value: string | number = 0;

}
