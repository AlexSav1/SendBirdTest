import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { Exhibition } from '../../models/Exhibition';
import { Artwork } from '../../models/Artwork';

declare var $: any;
declare const gapi: any;

@Component({
  selector: 'app-purchase-plan',
  templateUrl: './purchase-plan.component.html',
  styleUrls: ['./purchase-plan.component.css']
})
export class PurchasePlanComponent implements OnInit {

  fullName: string;
  bio: string;

  file: File;
  exhibitionHistory: Exhibition[] = [];
  artworks: Artwork[] = [];

  showNewExhibitionForm: boolean = false;

  newExhibition: Exhibition = {
    title: "",
    year: "",
    venue: "",
    isSolo: false
  };

  alertText: string;
  userEmail: string;
  googleEmail: string;
  loggedIntoGoogle: boolean = false;

  isSocial: boolean = true;
  isEmerging: boolean = false;
  isWorking: boolean = false;

  constructor(private authService: AuthService, private zone: NgZone, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  addArtwork() {
    console.log("addExhibition");
    const newArtwork = {
      title: "",
      year: "",
      askingPrice: "",
      imageUrl: ""
    }

    this.artworks.push(newArtwork);
  }

  addExhibition() {

    this.showNewExhibitionForm = true;

    // console.log("addExhibition");
    // const newExhibition = {
    //   title: "",
    //   year: "",
    //   venue: "",
    //   isSolo: true
    // }

    // this.exhibitionHistory.push(newExhibition);
  }

  saveExhibition() {
    console.log('new Exhibition: ', this.newExhibition);
    this.exhibitionHistory.push(this.newExhibition);
    this.showNewExhibitionForm = false;
    this.newExhibition = {
      title: "",
      year: "",
      venue: "",
      isSolo: false
    };
  }

  testExhibition() {
    console.log('Exhibition History: ', this.exhibitionHistory);
  }

  testArtwork() {
    console.log('title: ', this.artworks[0].title);
    console.log('year: ', this.artworks[0].year);
    console.log('askingPrice: ', this.artworks[0].askingPrice);
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log('file 0: ', file);

    this.file = file;
  }

  openCheckout(productName: string, amount: number, email: string, tokenCallback) {
    console.log('open form');
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_oPnAODlQePtI6vIrL7Bj6RaH',
      locale: 'auto',
      token: tokenCallback
      // token: function (token: any) {
      //   // You can access the token ID with `token.id`.
      //   // Get the token ID to your server-side code for use.
      //   console.log('take payment with token: ', token);

      //   this.authService.createCharge('token').subscribe(data => {
      //     console.log(data);
      //   });
      // }
    });

    handler.open({
      name: 'Con Artist Collective',
      description: productName,
      amount: amount,
      zipCode: false,
      email: email,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png"
    });

  }

  takePayment(productName: string, amount: number, token: any) {
    let body = {
        token: token,
        productName: productName,
        amount: amount,
        fullName: this.fullName,
        bio: this.bio
    };

    console.log('body', body)

    this.authService.createCharge(body).subscribe(data => {
      console.log('data', data);
      console.log('data.msg', data.msg);

      //this.showAlert(data.msg);

      if(data.token) {
        localStorage.setItem('token', 'JWT ' + data.token);
        localStorage.setItem('fullName', data.customer.fullName);
        localStorage.setItem('userId', data.customer._id);

        this.authService.connectToSendBird(data.customer._id);
        this.authService.updateSendBirdUser(null);
        //this.showAlert('Thanks you for your payment! You are now logged in.');
        $('#successModal').modal('show');
        // this.zone.run(() => {
        //   location.reload();
        //   this.router.navigate(['/dashboard']);
        // });
        
      }
      
      // this.router.navigate(['/dashboard']);
    }, err => {
      console.log('ERROR BOIZ', err);
      this.showAlert(err.error.msg);
    });

  }

  onPurchaseSocial() {

    if(!this.fullName || !this.bio || !this.userEmail) {
      this.showAlert('Please fill out everything.');
      return;
    }

    if(this.validateEmail(this.userEmail)) {

      if(this.isSocial == true) {
        this.openCheckout("Social Artist", 5000, this.userEmail, (token: any) => this.takePayment('plan_CgihkIJZ8f3xEb', 5000, token));
      }

      if(this.isEmerging == true) {
        this.openCheckout("Emerging Artist", 25000, this.userEmail, (token: any) => this.takePayment('plan_CiUnyA22j0CVZz', 25000, token));
      }

      if(this.isWorking == true) {
        this.openCheckout("Working Artist", 40000, this.userEmail, (token: any) => this.takePayment('plan_ChpFM6mWjW8l5r', 40000, token));
      }

    } else {
      this.showAlert('please enter a valid email address');
    }

  }

  onPurchaseSocialGoogle() {

    if(this.validateEmail(this.googleEmail)) {
      this.openCheckout("Social Artist", 5000, this.googleEmail, (token: any) => this.takePayment('plan_CgihkIJZ8f3xEb', 5000, token));
    } else {
      this.showAlert('please enter vaid email address');
    }

  }

  showSocial() {
    this.isSocial = true;
    this.isEmerging = false;
    this.isWorking = false;
  }

  showEmerging() {
    this.isSocial = false;
    this.isEmerging = true;
    this.isWorking = false;
  }

  showWorking() {
    this.isSocial = false;
    this.isEmerging = false;
    this.isWorking = true;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  showAlert(msg: string) {
      this.zone.run(() => {
        this.alertText = msg;
        $('#alertModal').modal('show');
      });
  }

//   public auth2: any;
//   public googleInit() {
//     gapi.load('auth2', () => {
//       this.auth2 = gapi.auth2.init({
//         client_id: '918293842501-p0qqmb45gh6svveg0efq3flttq0hk781.apps.googleusercontent.com',
//         cookiepolicy: 'single_host_origin',
//         scope: 'profile email'
//       });

//       this.attachSignin(document.getElementById('googleBtn'));
      
//     });
//   }
//   public attachSignin(element) {
//     this.auth2.attachClickHandler(element, {},
//       (googleUser) => {

//         let profile = googleUser.getBasicProfile();
//         console.log('Token || ' + googleUser.getAuthResponse().id_token);
//         console.log('ID: ' + profile.getId());
//         console.log('Name: ' + profile.getName());
//         console.log('Image URL: ' + profile.getImageUrl());
//         console.log('Email: ' + profile.getEmail());
//         //YOUR CODE HERE

//         const token = googleUser.getAuthResponse().id_token;
//         const email = profile.getEmail();

//         //this.loggedIntoGoogle = true;
//         this.googleEmail = email;

//         this.onPurchaseSocialGoogle();

//         // this.authService.googleLogin(email, token).subscribe(data => {
//         //   console.log('response date: ', data);

//         //   if(data.token) {
//         //     localStorage.setItem('token', 'JWT ' + data.token);
//         //     location.reload();
//         //     // this.router.navigate(['/dashboard']);
//         //     // this.onShowAlert(data.msg);
//         //   }
//         // });


//       }, (error) => {
//         //alert(JSON.stringify(error, undefined, 2));
//       });
//   }

// ngAfterViewInit(){
//       this.googleInit();
// }

}
