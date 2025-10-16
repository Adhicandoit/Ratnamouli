import { Component, signal } from '@angular/core';
import { NavBar } from "./Components/nav-bar/nav-bar";
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
