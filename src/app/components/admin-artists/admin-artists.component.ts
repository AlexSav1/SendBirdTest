import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

import { Artist } from '../../models/Artist';
import { Customer } from '../../models/Customer';

@Component({
  selector: 'app-admin-artists',
  templateUrl: './admin-artists.component.html',
  styleUrls: ['./admin-artists.component.css']
})
export class AdminArtistsComponent implements OnInit {

  artists: Customer[];
  resident: Customer;

  maxBioLength: number = 75;

  constructor(public adminService: AdminService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getFeaturedArtists().subscribe(artistJson => {
      //console.log('artist JSON' ,artistJson);
      
      if(artistJson) {
        this.artists = artistJson;
        this.artists.reverse();

        for(var i = 0; i < this.artists.length; i++) {
          if (this.artists[i].bio.length > this.maxBioLength) {
            this.artists[i].bio = this.artists[i].bio.substr(0, this.maxBioLength) + '...';
          }
        }
      }

      this.authService.getResidentArtist().subscribe(artistJson => {
        console.log('residentJson' , artistJson);
        
        if(artistJson) {
          this.resident = artistJson[0];

          if (this.resident.bio.length > this.maxBioLength) {
            this.resident.bio = this.resident.bio.substr(0, this.maxBioLength) + '...';
          }
        }
  
      });

    });
  }

  onNewArtist(artist: Customer) {
    this.artists.unshift(artist);
  }

  onNewResident(artist: Customer) {
    this.resident = artist;
  }

  removeResident(artist: Customer) {
    console.log('artist', artist);

    this.adminService.removeFromResident(artist._id).subscribe(data => {
      if(data.success) {
        this.resident = null;
      } else {
        console.log(data.error);
      }
    });

  }

  removeArtist(artist: Customer) {
    console.log('artist', artist);

    this.adminService.removeFromFeatured(artist._id).subscribe(data => {
      if(data.success) {
        this.artists.forEach((current, index) => {
          if(artist._id === current._id) {
            this.artists.splice(index, 1);
          }
        });
      } else {
        console.log(data.error);
      }
    });

    // this.adminService.deleteArtist(artist._id).subscribe(data => {
    //   if(data.success) {
    //     this.artists.forEach((current, index) => {
    //       if(artist._id === current._id) {
    //         this.artists.splice(index, 1);
    //       }
    //     });
    //   } else {
    //     console.log(data.error);
    //   }
    // });
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin']);
  }

}
