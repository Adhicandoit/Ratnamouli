import { Component, signal } from '@angular/core';
import { MainMenu } from './Components/main-menu/main-menu';

@Component({
  selector: 'app-root',
  imports: [MainMenu],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('feedbackForm');
}
