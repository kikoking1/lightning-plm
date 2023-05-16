import { Component } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor() {}

  navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/products', label: 'Products' },
  ];
}
