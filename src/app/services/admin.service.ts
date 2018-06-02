import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Poll } from '../models/Poll';
import { PollChoice } from '../models/PollChoice';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

const baseUrl = 'https://conartback.herokuapp.com/';

@Injectable()
export class AdminService {

  authToken: string;

  constructor(public http: HttpClient) { }

  // loginUser(user) {
  //   return this.http.post('http://localhost:3000/users/authenticate', user, httpOptions).map(res => res.json());
  // }

  adminLoggedIn(): boolean {
    const token = localStorage.getItem('id_token');

    if(token) {
     return true;
    } else {
      return false;
    }
  }

  addToResident(id: string): Observable<any> {

    const token = localStorage.getItem('id_token');

    console.log('id_token', token);

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    const body = {
      id: id
    }

    const bodyString = JSON.stringify(body);

    return this.http.post(baseUrl + 'users/add_resident', body, authHttpOptions);
  }

  removeFromResident(id: string): Observable<any> {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    const body = {
      id: id
    }

    const bodyString = JSON.stringify(body);

    return this.http.post(baseUrl + 'users/remove_resident', body, authHttpOptions);
  }

  addToFeatured(id: string): Observable<any> {

    const token = localStorage.getItem('id_token');

    console.log('id_token', token);

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    const body = {
      id: id
    }

    const bodyString = JSON.stringify(body);

    return this.http.post(baseUrl + 'users/add_feature', body, authHttpOptions);
  }

  removeFromFeatured(id: string): Observable<any> {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    const body = {
      id: id
    }

    const bodyString = JSON.stringify(body);

    return this.http.post(baseUrl + 'users/remove_feature', body, authHttpOptions);
  }

  loginAdminUser(user: any): Observable<any> {
    console.log('hello');

    return this.http.post(baseUrl + 'users/authenticate', user, httpOptions);
  }

  uploadEvent(file: File, title: string, onView: string, bio: string, galleryParty: string, memberOnly: boolean): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'undefined', 'Authorization': token})
    }

    return this.http.post(baseUrl + `users/new_event?title=${title}&bio=${bio}&onview=${onView}&galleryParty=${galleryParty}&memberOnly=${memberOnly}`, file, authHttpOptions);
  }

  uploadPoll(title: string, choices: PollChoice[]): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const poll = {
      title: title,
      choices: choices
    }

    const bodyString = JSON.stringify(poll);

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
    }

    return this.http.post(baseUrl + 'users/new_poll', bodyString, authHttpOptions);
  }

  deletePoll(id: string): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
   }

    console.log('making request with id: ', id);

    return this.http.delete(baseUrl + `users/poll/${id}`, authHttpOptions);
  }

  deleteEvent(id: string): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
   }

    console.log('making request with id: ', id);

    return this.http.delete(baseUrl + `users/event/${id}`, authHttpOptions);
  }

  uploadArtist(file: File, name: string, bio: string): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'undefined', 'Authorization': token})
    }

    return this.http.post(baseUrl + `users/new_artist?name=${name}&bio=${bio}`, file, authHttpOptions);
  }

  deleteArtist(id: string): Observable<any>  {

    const token = localStorage.getItem('id_token');

    if(!token) {
      console.log('no token');
      return;
    }

    const authHttpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': token})
   }

    console.log('making request with id: ', id);

    return this.http.delete(baseUrl + `users/artist/${id}`, authHttpOptions);
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout() {
    this.authToken = null;
    localStorage.removeItem('id_token');
  }

}
