import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { Artist } from '../../models/Artist';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css']
})
export class ArtistListComponent implements OnInit {

  searchText: string = "";

  featuredArtists: Customer[];
  artists: Customer[];
  resident: Customer;

  currentPage: number = 1;

  morePages: boolean = true;
  countPerPage: number = 10;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    window.scrollTo(0, 0);

    this.authService.getFeaturedArtists().subscribe(artistJson => {
      this.featuredArtists = artistJson;

      this.authService.getResidentArtist().subscribe(residentJson => {
        this.resident = residentJson[0];
        this.featuredArtists.unshift(this.resident);
        this.getArtists(1);
      });
      
    });

    
  }

  getArtists(page: number) {
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

  onSearch(event) {

    this.searchText = event;

    if(this.searchText.length == 0) {
      this.authService.getCustomerArtists(1).subscribe(data => {
        console.log('artistJson' ,data);
        
        if(data.customers) {
          this.artists = data.customers;
          //this.artists.reverse();
        }
      });
    } else {
      this.authService.searchArtists(this.searchText).subscribe(artistJson => {
        console.log(artistJson);
  
        if(artistJson) {
          this.artists = artistJson;
          //this.artists.reverse();
        }
      });
    }

  }

}
