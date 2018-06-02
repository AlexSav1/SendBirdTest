import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { Event } from '../../models/Event';
import { Artist } from '../../models/Artist';
import { Customer } from '../../models/Customer';
import { ArtistSlide } from '../../models/ArtistSlide';
import { Poll } from '../../models/Poll';
import { PollChoice } from '../../models/PollChoice';

declare var $: any;
declare const gapi: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  fullName: string;

  events: Event[];
  memberEvents: Event[] = [];
  publicEvents: Event[] = [];
  artists: Customer[];
  artistSlides: ArtistSlide[] = [];
  artistIndex: number = 0;
  resident: Customer;
  
  polls: Poll[];

  userEmail: string;

  maxBioLength: number = 75;
  maxResidentBioLength: number = 250;
  maxEvents: number = 3;
  maxArtists: number = 4;

  alertText: string;

  projectName: string;
  projectEmail: string;
  projectPhone: string;
  projectProposal: string;
  projectBudget: string;

  constructor(public authService: AuthService, private route: ActivatedRoute, private router: Router, private zone: NgZone) { }

  ngOnInit() {

    const token = this.route.snapshot.queryParams['token'];

    console.log('token: ', token);

    if(token) {
      localStorage.setItem('token', 'JWT ' + token);

      this.authService.getCustomerInfo().subscribe(data => {
        this.fullName = data.user.fullName;
        localStorage.setItem('fullName', data.user.fullName);
        localStorage.setItem('userId', data.user._id);
        this.authService.connectToSendBird(data.customer._id);
      });

    }

    this.fullName = localStorage.getItem('fullName');

    this.authService.getEvents().subscribe(eventJson => {
      
      
      if(eventJson) {
        this.events = eventJson;
        this.events.reverse();

        for(let event of this.events) {
          if(event.memberOnly == true) {
            this.memberEvents.unshift(event);
          } else {
            this.publicEvents.unshift(event);
          }
        }

        console.log('memberEvents: ', this.memberEvents);
        console.log('publicEvents: ', this.publicEvents);

        // if(this.events.length > this.maxEvents) {
        //   this.events.splice(this.maxEvents, this.events.length - this.maxEvents);
        // }

        for(var i = 0; i < this.events.length; i++) {
          if (this.events[i].bio.length > this.maxBioLength) {
            this.events[i].bio = this.events[i].bio.substr(0, this.maxBioLength) + '...';
          }
        }

      }

      this.authService.getFeaturedArtists().subscribe(artistJson => {
        console.log('artistJson' , artistJson);
        
        if(artistJson) {
          this.artists = artistJson;
          this.artists.reverse();

          for(var i = 0; i < this.artists.length; i++) {
            if (this.artists[i].bio.length > this.maxBioLength) {
              this.artists[i].bio = this.artists[i].bio.substr(0, this.maxBioLength) + '...';
            }
          }

          this.makeSlides();

          // if(this.artists.length > this.maxArtists) {
          //   this.artists.splice(this.maxArtists, this.artists.length - this.maxArtists);
          // }
        }

        this.authService.getResidentArtist().subscribe(artistJson => {
          console.log('residentJson' , artistJson);
          
          if(artistJson) {
            this.resident = artistJson[0];

            if (this.resident.bio.length > this.maxResidentBioLength) {
              this.resident.bio = this.resident.bio.substr(0, this.maxResidentBioLength) + '...';
            }
            
          }

          this.authService.getPolls().subscribe(data => {
            console.log('polls: ', data)
            this.polls = data;

            for(let poll of this.polls) {
              this.getChoicePercentages(poll);
            }
          });
    
        });
  
      });

    });
  
  }

  getChoicePercentages(poll: Poll) {

    console.log('getChoicePercentages');

    var totalVotes = 0;

    for(let choice of poll.choices) {
      if(!choice.votes) {
        choice.votes = 0;
      }
      totalVotes += choice.votes;
    }

    console.log('totalVotes: ', totalVotes);

    for(let choice of poll.choices) {
      console.log('choice.votes: ', choice.votes);
      //const percentage =  String((choice.votes / totalVotes) * 100) + '%' ;
      choice.votePercentage = (choice.votes / totalVotes) * 100;
      console.log('choice.votePercentage: ', choice.votePercentage);
    }

  }
  
  makeSlides() {
    const numberOfSlides = this.artists.length / 4;

    for(var slideIndex = 0; slideIndex < numberOfSlides; slideIndex++) {

      const numberOfArtistsLeft = this.artists.length

      const startingIndex = slideIndex * 4;

      var newSlide: ArtistSlide = {
        artists: [],
        index: slideIndex
      }

      var newIndex = 0;

      for(var artistIndex = startingIndex; artistIndex < this.artists.length; artistIndex++) {
        if(newIndex == 4) {
          break;
        }
        newSlide.artists.unshift(this.artists[startingIndex + newIndex]);
        newIndex++;
      }

      this.artistSlides.unshift(newSlide);

      // for(var artistIndex = 0; artistIndex <= 4; artistIndex++) {
      //   newSlide.artists.unshift(this.artists[artistIndex + slideIndex]);
      // }
    }

    console.log('slides: ', this.artistSlides);

  }

  onVote(poll: Poll, choice: PollChoice) {
    this.authService.voteOnPoll(poll, choice).subscribe(data => {
      console.log(data);

      if(data.success == true) {

        const id = localStorage.getItem('userId');

        poll.voters.unshift(id);

        if(choice.votes) {
          choice.votes += 1;
        } else {
          choice.votes = 1;
        }

        this.getChoicePercentages(poll);

      }

      
    });
  }

  didVote(poll: Poll): boolean {

    const id = localStorage.getItem('userId');

    console.log('didVote() id: ', id);

    if(poll.voters.includes(id)) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      return false;
    }
  }

  openCheckout(productName: string, amount: number, tokenCallback) {
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
      image: "https://stripe.com/img/documentation/checkout/marketplace.png"
    });

  }

  takePayment(productName: string, amount: number, token: any) {
    let body = {
        token: token,
        productName: productName,
        amount: amount
    };

    console.log('body', body)

    this.authService.createCharge(body).subscribe(data => {
      console.log(data);
      // this.alertText = data.msg;
      // $('#alertModal').modal('show');
    });

  }

  onPurchaseSocial() {
    this.openCheckout("Social Artist", 5000, (token: any) => this.takePayment("Social Artist", 5000, token));
  }

  onPurchaseEmerging() {
    this.openCheckout("Emerging Artist", 25000, (token: any) => this.takePayment("Emerging Artist", 25000, token));
  }

  onPurchaseWorking() {
    this.openCheckout("Working Artist", 40000, (token: any) => this.takePayment("Working Artist", 40000, token));
  }

  sendEmail() {
    console.log(this.userEmail);
    this.authService.sendEmail(this.userEmail).subscribe(data => {
      console.log(data);
    });
  }

  onShowAlert(msg: string) {
    this.alertText = msg;
    $('#alertModal').modal('show');
  }

  onJoin() {
    $('#exampleModal').modal('hide');
    //this.router.navigate(['/plan']);
  }

  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  // public auth2: any;
  // public googleInit() {
  //   gapi.load('auth2', () => {
  //     this.auth2 = gapi.auth2.init({
  //       client_id: '918293842501-p0qqmb45gh6svveg0efq3flttq0hk781.apps.googleusercontent.com',
  //       cookiepolicy: 'single_host_origin',
  //       scope: 'profile email'
  //     });

  //     this.attachSignin(document.getElementById('googleBtn'));
      
  //   });
  // }
  // public attachSignin(element) {
  //   this.auth2.attachClickHandler(element, {},
  //     (googleUser) => {

  //       let profile = googleUser.getBasicProfile();
  //       console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //       console.log('ID: ' + profile.getId());
  //       console.log('Name: ' + profile.getName());
  //       console.log('Image URL: ' + profile.getImageUrl());
  //       console.log('Email: ' + profile.getEmail());

  //       const token = googleUser.getAuthResponse().id_token;
  //       const email = profile.getEmail();

  //       this.authService.googleLogin(email, token).subscribe(data => {
  //         console.log('response date: ', data);

  //         if(data.token) {
  //           localStorage.setItem('token', 'JWT ' + data.token);
  //           localStorage.setItem('fullName', data.customer.fullName);
  //           localStorage.setItem('userId', data.customer._id);

  //           location.reload();
  //           // this.router.navigate(['/dashboard']);
  //           // this.onShowAlert(data.msg);
  //         } else {
  //           //this.alertText = 'No account found. Please purchase a plan to create your account.';
  //           //console.log('alertText: ', this.alertText);
  //           $('#googleModal').modal('show');
  //         }
  //       });


  //     }, (error) => {
  //       //alert(JSON.stringify(error, undefined, 2));
  //     });
  // }

  //   ngAfterViewInit(){
  //     this.googleInit();
  //   }

    validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    onProjectSubmit() {

      console.log('projectName: ', this.projectName);

      if(!this.projectName || !this.projectEmail || !this.projectProposal || !this.projectBudget) {
        this.alertText = 'Please fill out completely.';
        $('#alertModal').modal('show');
        return;
      }

      if(!this.validateEmail(this.projectEmail)) {
        this.alertText = 'Please enter a valid email address';
        $('#alertModal').modal('show');
        return;
      }

      this.authService.sendProjectEmail(this.projectName, this.projectEmail, this.projectPhone, this.projectProposal, this.projectBudget).subscribe(data => {
        console.log('project email return data: ', data);

        this.onShowAlert('Your email was sent!');
        this.projectName = "";
        this.projectEmail = "";
        this.projectPhone = "";
        this.projectProposal = "";
        this.projectBudget = "";

      });
    }
}
