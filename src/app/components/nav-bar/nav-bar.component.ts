import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var $: any;
declare const gapi: any;

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private toggleButton: any;
  private sidebarVisible: boolean;

  userEmail: string;

  constructor(public authService: AuthService, private router: Router, private element : ElementRef) { }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('userId');

    if(this.router.isActive('/', true)) {
      location.reload();
    }

    this.router.navigate(['/']);
  }

  sendEmail() {
    console.log(this.userEmail);
    this.authService.sendEmail(this.userEmail).subscribe(data => {
      console.log(data);
    });
  }

  onJoin() {
    $('#emailModal').modal('hide');
    //this.router.navigate(['/plan']);
  }

  public auth2: any;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '918293842501-p0qqmb45gh6svveg0efq3flttq0hk781.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('googleBtn'));
      
    });
  }
  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());

        const token = googleUser.getAuthResponse().id_token;
        const email = profile.getEmail();

        this.authService.googleLogin(email, token).subscribe(data => {
          console.log('response date: ', data);

          if(data.token) {
            localStorage.setItem('token', 'JWT ' + data.token);
            localStorage.setItem('fullName', data.customer.fullName);
            localStorage.setItem('userId', data.customer._id);

            location.reload();
            // this.router.navigate(['/dashboard']);
            // this.onShowAlert(data.msg);
          } else {
            //this.alertText = 'No account found. Please purchase a plan to create your account.';
            //console.log('alertText: ', this.alertText);
            $('#googleModal').modal('show');
          }
        });


      }, (error) => {
        //alert(JSON.stringify(error, undefined, 2));
      });
  }

  ngAfterViewInit(){
    this.googleInit();
  }

}
