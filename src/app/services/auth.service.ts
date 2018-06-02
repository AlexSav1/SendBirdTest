import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { Poll } from '../models/Poll';
import { PollChoice } from '../models/PollChoice';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

const baseUrl = 'https://conartback.herokuapp.com/';

//const baseUrl = 'http://localhost:3000/';
//declare var require: any
//import SendBird from 'SendBird';
//import { SendBird } from 'SendBird';
//var SendBird = require('SendBird');
//var sb = new SendBird({'appId': 'CD570882-A009-46D4-8397-F449C4E8D26C'});

//import * as SendBird from 'SendBird';
//var sb = new SendBird({'appId': 'CD570882-A009-46D4-8397-F449C4E8D26C'});

@Injectable()
export class AuthService {

  //sb: any;

  private isConnected: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(public http: HttpClient, private router: Router) {
    console.log('Data service connected...');

    //this.sb = new SendBird({'appId': 'CD570882-A009-46D4-8397-F449C4E8D26C'});

    const userId = localStorage.getItem('userId');

    if(userId) {
      this.connectToSendBird(userId);
    }
  }

  // sb() {
  //   return sb;
  // }

  connectToSendBird(userId: string) {
    // this.sb.connect(userId, (user, error) => {
    //   if(error) {
    //     console.log('error: ', error);
    //   }

    //   if(user) {
    //     console.log('Sb user connected... ');
    //     this.isConnected.next(true);        
    //   }
    // });
  } 

  updateSendBirdUser(profileUrl?: string) {
    const name = localStorage.getItem('fullName');
    var url = "";

    if(profileUrl) {
      url = profileUrl;
    }

    // this.sb.updateCurrentUserInfo(name, url, (response, error) => {
    //   console.log(response, error);
    // });
  }

  public connectionStatus(): Observable<boolean> {
    return this.isConnected.asObservable();
  }

   isAdminRoute(): boolean {
    if(this.router.url.includes('/admin')) {
     return true;
    } else {
     return false;
    }
  }

   isStoreRoute(): boolean {
     if(this.router.url === '/store' ) {
      return true;
     } else {
      return false;
     }
   }

   loggedIn(): boolean {
     const token = localStorage.getItem('token');

     if(token) {
      return true;
     } else {
       return false;
     }
   }

  getEvents(): Observable<any> {

    return this.http.get(baseUrl + 'users/event', httpOptions);
  }

  getSpecificEvent(id: string): Observable<any> {

    return this.http.get(baseUrl + `users/event/${id}`, httpOptions);
  }

  getArtists(): Observable<any> {

    return this.http.get(baseUrl + 'users/artist', httpOptions);
  }

  getCustomerArtists(page: number): Observable<any> {

    const count = 10;

    return this.http.get(baseUrl + `users/allcustomer?count=${count}&page=${page}`, httpOptions);
  }

  getFeaturedArtists(): Observable<any> {

    return this.http.get(baseUrl + 'users/allfeatured', httpOptions);
  }

  getPolls(): Observable<any> {

    return this.http.get(baseUrl + 'users/polls', httpOptions);
  }

  getResidentArtist(): Observable<any> {

    return this.http.get(baseUrl + 'users/resident', httpOptions);
  }

  getSpecificCustomer(id: string): Observable<any> {

    return this.http.get(baseUrl + `users/customer/${id}`, httpOptions);
  }

  voteOnPoll(poll: Poll, choice: PollChoice): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    const body = {
      pollId: poll._id,
      choiceId: choice._id
    }

    console.log('body: ', body);
    let bodyString = JSON.stringify(body);
    return this.http.patch(baseUrl + 'users/polls', bodyString, authHttpOptions);
  }

  searchArtists(searchQuery: string): Observable<any> {

    return this.http.get(baseUrl + `users/search?search=${searchQuery}`, httpOptions);
  }

  updateCustomerProfilePic(file: File): Observable<any>  {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'undefined', 'Authorization': token})
    }

    return this.http.post(baseUrl + 'users/updateprofile', file, authHttpOptions);
  }

  updateCustomerCoverPic(file: File): Observable<any>  {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'undefined', 'Authorization': token})
    }

    return this.http.post(baseUrl + 'users/updatecover', file, authHttpOptions);
  }

  updateCustomerInfo(body: any): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('update customer info');
    let bodyString = JSON.stringify(body);
    return this.http.patch(baseUrl + 'users/customer', bodyString, authHttpOptions);
  }

  uploadNewArtwork(file: File, title: string, year: string, dimensions: string ,askingPrice: string): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'undefined', 'Authorization': token})
    }

    return this.http.post(baseUrl + `users/artwork?title=${title}&year=${year}&dimensions=${dimensions}&askingPrice=${askingPrice}`, file, authHttpOptions);
  }

  deleteArtwork(id: string): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    return this.http.delete(baseUrl + `users/delete_artwork/${id}`, authHttpOptions);
  }

  uploadExhibition(title: string, year: string, venue: string): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const body = {
      title: title,
      year: year,
      venue: venue
    }

    let bodyString = JSON.stringify(body);

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    return this.http.post(baseUrl + 'users/exhibition', bodyString, authHttpOptions);
  }

  deleteExhibition(id: string): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    return this.http.delete(baseUrl + `users/delete_exhibition/${id}`, authHttpOptions);
  }

  getSpecificArtist(id: string): Observable<any> {

    return this.http.get(baseUrl + `users/artist/${id}`, httpOptions);
  }

  getCustomerInfo(): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('token', token);
    console.log(authHttpOptions);

    return this.http.get(baseUrl + `users/info`, authHttpOptions);
  }

  testCharge(): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('token', token);
    console.log(authHttpOptions);

    return this.http.get(baseUrl + `users/testcharge`, authHttpOptions);
  }

  createCharge(body: any): Observable<any> {
    console.log('hello');
    let bodyString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/charge', bodyString, httpOptions);
  }

  updateCustomerCard(body: any): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('update card');
    let bodyString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/updatecard', bodyString, authHttpOptions);
  }

  changePlan(body: any): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('change plan');
    let bodyString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/updateplan', bodyString, authHttpOptions);
  }

  cancelSub(subId: string): Observable<any> {

    const token = localStorage.getItem('token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
       headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    console.log('cancel sub');

    const body = {
      subId: subId
    }

    let bodyString = JSON.stringify(body);

    return this.http.post(baseUrl + 'users/cancel', bodyString, authHttpOptions);
  }

  sendEmail(email: string) {
    console.log('email');

    const body = {
      email: email
    }

    let emailString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/sendtoken', emailString, httpOptions);
  }

  googleLogin(email: string, token: string): Observable<any> {

    const body = {
      token: token,
      email: email
    }

    let bodyString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/googlesignin', bodyString, httpOptions);
  }

  sendProjectEmail(projectName: string, projectEmail: string, projectPhone: string, projectProposal: string, projectBudget: string): Observable<any> {
    console.log('hello');

    const body = {
      projectName: projectName,
      projectEmail: projectEmail,
      projectPhone: projectPhone,
      projectProposal: projectProposal,
      projectBudget: projectBudget
    }

    let bodyString = JSON.stringify(body);
    return this.http.post(baseUrl + 'users/projectemail', bodyString, httpOptions);
  }

}
