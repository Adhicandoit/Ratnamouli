import { Component, Input } from '@angular/core';
import { LogoComponent } from '../logo/logo';

@Component({
  selector: 'app-nav-bar',
  imports: [LogoComponent],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  @Input() src: string = 'app/Components/nav-bar/Ratnamouli-Palace-Logo.jpg';
  @Input() alt: string = 'Image';

}
