import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  constructor(private router: Router) {
    this.signOut();
  }

  signOut() {
    localStorage.removeItem('login')
    this.router.navigate(['/login'])
  }
}
