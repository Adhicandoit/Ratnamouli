import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrls: ['./logo.css']  // should be plural: style**s**Urls
})
export class LogoComponent {     
  @Input() src: string = 'assets/Ratnamouli-Palace-Logo.jpg'; 
  @Input() alt: string = 'Image';
}
