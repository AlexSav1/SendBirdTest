import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent implements OnInit {

  @Output() showAlert: EventEmitter<string> = new EventEmitter();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
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
      console.log('data', data);
      console.log('data.msg', data.msg);

      this.showAlert.emit(data.msg);

      if(data.token) {
        localStorage.setItem('token', 'JWT ' + data.token);
      }
      
      // this.router.navigate(['/dashboard']);
    }, err => {
      console.log('ERROR BOIZ', err);
      this.showAlert.emit(err.error.msg);
    });

  }

  onPurchaseSocial() {
    this.openCheckout("Social Artist", 5000, (token: any) => this.takePayment('plan_CgihkIJZ8f3xEb', 5000, token));
  }

  onPurchaseEmerging() {
    this.openCheckout("Emerging Artist", 25000, (token: any) => this.takePayment('plan_CiUnyA22j0CVZz', 25000, token));
  }

  onPurchaseWorking() {
    this.openCheckout("Working Artist", 40000, (token: any) => this.takePayment('plan_ChpFM6mWjW8l5r', 40000, token));
  }

}
