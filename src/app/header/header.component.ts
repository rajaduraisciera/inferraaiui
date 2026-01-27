import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  @Input() showUsername: boolean = true;
  @Input() showChevron: boolean = true;
  isDropdownOpen: boolean = false;
  userName: string | null = null;
  emailId: string | null = null;

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  ngOnInit(): void {
    const loginid = localStorage.getItem('login');
    console.log("Login ID from localStorage:", loginid);

    if (loginid) {
      try {
        const credentials = JSON.parse(loginid).credential;
        const decodedToken: any = jwtDecode(credentials);

        this.userName = decodedToken.name || null;
        this.emailId = decodedToken.email || null;

        console.log(this.userName);
           console.log(this.emailId);

        const given_name = decodedToken.given_name || null;
        const family_name = decodedToken.family_name || null;

        this.userName = `${given_name} ${family_name.charAt(0)}`;
        this.userName = this.userName.toUpperCase();

      } catch (error) {
        console.error('Error decoding JWT token:', error);
      }
    } else {
      console.info("No login credentials found");
    }
  }
}


