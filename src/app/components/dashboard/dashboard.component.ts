import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { Card } from '../../models/Card';
import { Exhibition } from '../../models/Exhibition';
import { Artwork } from '../../models/Artwork';
import { Customer } from '../../models/Customer';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  customer: any;
  card: Card;
  currentPlan: string;
  currentEmail: string;
  planUpgradeString: string;
  subscriptionId: string;
  periodEnd: string;

  isCancelled: boolean = false;

  socialPlan: boolean = false;
  emergingPlan: boolean = false;
  unlimitedPlan: boolean = false;

  alertText: string;

  //profile stuff
  currentCustomer: Customer;

  fullName: string;
  bio: string;

  profileFile: File;
  exhibitionHistory: Exhibition[] = [];
  artworks: Artwork[] = [];

  showNewExhibitionForm: boolean = false;

  newExhibition: Exhibition = {
    title: "",
    year: "",
    venue: "",
    isSolo: false
  };

  constructor(private authService: AuthService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.pullInfo();
  }

  onChangeProfile(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.profileFile = file;
  }

  confirmProfileChanges() {
    console.log('current customer: ', this.currentCustomer);
    console.log('current customer JSON: ', JSON.stringify(this.currentCustomer));
  }

  pullInfo() {
    console.log('pulling');
    this.authService.getCustomerInfo().subscribe(data => {
      
      this.customer = data.customer;
      console.log('data', data);
      this.currentCustomer = data.user;
      console.log('customer sub', this.customer.subscriptions.data[0].id);
      //console.log('current period end', this.customer.subscriptions.data[0].current_period_end);

      const periodEnd = this.customer.subscriptions.data[0].current_period_end;
      const cancelAtPeriodEnd = this.customer.subscriptions.data[0].cancel_at_period_end;

      if(cancelAtPeriodEnd == true) {
        this.isCancelled = true;
      } else {
        this.isCancelled = false;
      }

      console.log('cancelAtPeriodEnd: ', cancelAtPeriodEnd);

      const planId = this.customer.subscriptions.data[0].plan.id;

      const cardInfo = this.customer.sources.data[0];

      this.currentEmail = this.customer.email;

      this.subscriptionId = this.customer.subscriptions.data[0].id;

      this.periodEnd = new Date(periodEnd*1000).toDateString();

      if(cardInfo) {
        this.card = cardInfo;
      }

      this.socialPlan = false;
      this.emergingPlan = false;
      this.unlimitedPlan = false;

      if(planId == 'plan_CgihkIJZ8f3xEb') {
        this.socialPlan = true
        this.currentPlan = "Social Artist: $50/month"
      }

      if(planId == 'plan_CiUnyA22j0CVZz') {
        this.emergingPlan = true;
        this.currentPlan = "Emerging Artist: $250/month"
      }

      if(planId == 'plan_ChpFM6mWjW8l5r') {
        this.unlimitedPlan = true
        this.currentPlan = "Working Artist: $400/month"
      }

    });
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
      email: this.currentEmail,
      image: "https://stripe.com/img/documentation/checkout/marketplace.png"
    });

  }

  takePayment(planId: string, token: any) {
    let body = {
        token: token,
        planId: planId 
    };

    console.log('body', body)

    this.authService.createCharge(body).subscribe(data => {
      console.log(data);
    });

  }

  changePlan(planId: string) {
    let body = {
      planId: planId 
    };

    console.log('body', body)

    this.authService.changePlan(body).subscribe(data => {
      console.log(data);
      this.pullInfo();
      this.alertText = 'successfully updated plan!';
      $('#alertModal').modal('show');
    }, err => {
      console.log('ERROR BOIZ', err);
      this.alertText = err.error.msg;
      $('#alertModal').modal('show');
    });
  }

  updateCard(token: any) {
    let body = {
        token: token
    };

    console.log('body', body)

    this.authService.updateCustomerCard(body).subscribe(data => {
      console.log(data);
      this.alertText = 'successfully updated plan!';
      $('#alertModal').modal('show');
    }, err => {
      console.log('ERROR BOIZ', err);
      this.alertText = err.error.msg;
      $('#alertModal').modal('show');
    });

  }

  cancelSub() {
  
    this.authService.cancelSub(this.subscriptionId).subscribe(data => {
      console.log(data);
      this.pullInfo();
      this.alertText = 'successfully cancelled subscription!';
      $('#alertModal').modal('show');
    }, err => {
      console.log('ERROR BOIZ', err);
      this.alertText = err.error.msg;
      $('#alertModal').modal('show');
    });

  }

  updateCardInfo() {
    this.openCheckout("Update Card Info", 0, (token: any) => this.updateCard(token));
  }

  // onPurchaseSocial() {
  //   this.openCheckout("Social Artist", 5000, (token: any) => this.takePayment('plan_CgihkIJZ8f3xEb', token));
  // }

  // onPurchaseEmerging() {
  //   this.openCheckout("Emerging Artist", 25000, (token: any) => this.takePayment('plan ID', token));
  // }

  // onPurchaseWorking() {
  //   this.openCheckout("Working Artist", 40000, (token: any) => this.takePayment('plan_ChpFM6mWjW8l5r', token));
  // }

  onPurchaseSocial() {
    console.log('onPurchaseEmerging()');
    this.changePlan('plan_CgihkIJZ8f3xEb');
  }

  onPurchaseEmerging() {
    console.log('onPurchaseEmerging()');
    this.changePlan('plan_CiUnyA22j0CVZz');
  }

  onPurchaseWorking() {
    console.log('onPurchaseWorking()');
    this.changePlan('plan_ChpFM6mWjW8l5r');
  }

  updatePlanUpgradeString(plan: string) {

    var text = "";

    if(plan == 'social') {
      text = "Social for $50"
    }

    if(plan == 'emerging') {
      text = "Emerging for $250"
    }

    if(plan == 'working') {
      text = "Working for $400"
    }

    this.planUpgradeString = `Upgrade Subscription to ${text} a Month`
  }

  upgradePlan() {
    if(this.planUpgradeString == 'Upgrade Subscription to Social for $50 a Month') {
      this.onPurchaseSocial();
    }

    if(this.planUpgradeString == 'Upgrade Subscription to Emerging for $250 a Month') {
      this.onPurchaseEmerging();
    }

    if(this.planUpgradeString == 'Upgrade Subscription to Working for $400 a Month') {
      this.onPurchaseWorking();
    }
  }

}
