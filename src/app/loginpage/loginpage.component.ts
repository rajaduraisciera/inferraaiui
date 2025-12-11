import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-loginpage',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})
export class LoginpageComponent implements AfterViewInit {

  constructor(private router: Router) {}
  
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
    const idToken = response.credential;
    console.log("Google ID Token:", idToken);

    // You can navigate or send token to backend later
    alert("Logged in successfully with Google!");
this.router.navigate(['/searchpage'])

  }
}
  