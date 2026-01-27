import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Component({
  selector: 'app-loginpage',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent implements AfterViewInit {

  idToken: string = '';

  constructor(private router: Router) { }

  clientId: any = '895217786394-en7fb4m50ol4l6dtjdrj3kmgho9ul0gd.apps.googleusercontent.com';

  ngAfterViewInit(): void {
    this.loadGoogleButton();
  }

  loadGoogleButton() {
    const tryInit = () => {
      if (typeof google === 'undefined') {
        setTimeout(tryInit, 100);
        return;
      }

      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response: any) => this.handleLogin(response)
      });

      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        {
          theme: 'outline',
          size: 'large',
          width: '300'
        }
      );
    };

    tryInit();
  }

  handleLogin(response: any) {
    this.idToken = response.credential;
    console.log("Google ID Token:", this.idToken);
    const userDetails = this.getUserName();    
    if (userDetails) {
      alert("Logged in successfully with Google!");
      this.router.navigate(['/searchpage'], { 
        state: { 
          userName: userDetails.userName,
          email: userDetails.email
        } 
      });
    }
  }


  getUserName() {
    if (this.idToken) {
      try {
        const decodedToken: any = jwtDecode(this.idToken);
        let userName = decodedToken.name || null;
        const given_name = decodedToken.given_name || null;
        const family_name = decodedToken.family_name || null;
        const email = decodedToken.email || null;
        userName = `${given_name} ${family_name.charAt(0)}`;
        console.log('userName:', userName);
        console.log('given_name:', given_name);
        console.log('family_name:', family_name);
        console.log('userName:', userName);
        console.log('email:', email);

        return {
          userName,
          email
        };

      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
      }
    } else {
      console.info("No login credentials found");
      return null;
    }
  }
}

