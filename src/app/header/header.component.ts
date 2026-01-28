import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Input() showUsername: boolean = true;
  @Input() showChevron: boolean = true;
  isDropdownOpen: boolean = false;
  userName: string | null = null;
  emailId: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userName: string, email: string };

    if (state) {
      this.userName = state.userName;
      console.log('User Name:', state.userName);
      console.log('Email:', state.email);
      console.log('User Name :', this.userName);
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnInit(): void {
    
  }
}


