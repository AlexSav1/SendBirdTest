import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

import { Artist } from '../../models/Artist';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-admin-artist-form',
  templateUrl: './admin-artist-form.component.html',
  styleUrls: ['./admin-artist-form.component.css']
})
export class AdminArtistFormComponent implements OnInit {

  currentPage: number = 1;
  showPages: boolean = true;

  countPerPage: number = 10;
  morePages: boolean = true;

  searchText: string;
  artists: Customer[];

  name: string;
  bio: string;
  file: File;

  @Output() newArtist: EventEmitter<Customer> = new EventEmitter();
  @Output() newResident: EventEmitter<Customer> = new EventEmitter();

  constructor(private adminService: AdminService, private authService: AuthService) { }

  ngOnInit() {
    this.getArtists(1);
  }

  getArtists(page: number) {
    this.showPages = true;
    this.authService.getCustomerArtists(page).subscribe(data => {
      console.log('artistJson' , data);
      
      if(data.customers) {
        this.artists = data.customers;

        if(this.artists.length < this.countPerPage) {
          this.morePages = false;
        } else {
          this.morePages = true;
        }

        //this.artists.reverse();
      }
    });
  }

  nextPage() {
    this.currentPage += 1;
    this.getArtists(this.currentPage);
  }

  previousPage() {
    this.currentPage -= 1;
    this.getArtists(this.currentPage);
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.file = file;
  }

  addToFeatured(artist: Customer) {
    console.log('addToFeatured');
    this.adminService.addToFeatured(artist._id).subscribe(data => {
      console.log(data);
      artist.featured = true;
      this.newArtist.emit(data.customer);
    });
  }

  addToResident(artist: Customer) {
    console.log('addToResident');
    this.adminService.addToResident(artist._id).subscribe(data => {
      console.log(data);
      artist.resident = true;
      this.newResident.emit(data.customer);
    });
  }

  onSearch(event) {

    this.searchText = event;

    if(this.searchText.length == 0) {
      this.getArtists(1);
    } else {
      this.showPages = false;
      this.authService.searchArtists(this.searchText).subscribe(artistJson => {
        console.log(artistJson);
  
        if(artistJson) {
          this.artists = artistJson;
          //this.artists.reverse();
        }
      });
    }

  }

  // onSubmit() {
  //   if(!this.file || !this.name || !this.bio) {
  //     alert('please fill out completely');
  //     return;
  //   }

  //   this.adminService.uploadArtist(this.file, this.name, this.bio).subscribe(data => {
  //     console.log(data);

  //     if(data.success) {
  //       alert('successfully uploaded artist!');

  //       const newArtist: Artist = data.doc;
  //       console.log('newArtist', newArtist);

  //       this.newArtist.emit(newArtist);

  //       this.name = null;
  //       this.bio = null;
  //       this.file = null;

  //     } else {
  //       alert('an error occured');
  //     }
  //   });
  // }

}
