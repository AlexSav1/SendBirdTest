import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { Artist } from '../../models/Artist';

import { Customer } from '../../models/Customer';
import { Exhibition } from '../../models/Exhibition';
import { Artwork } from '../../models/Artwork';

declare var $: any;

@Component({
  selector: 'app-edit-artist',
  templateUrl: './edit-artist.component.html',
  styleUrls: ['./edit-artist.component.css']
})
export class EditArtistComponent implements OnInit {

  customer: Customer;
  profileFile: File;

  fullName: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  bio: string;

  showNewExhibitionForm: boolean = false;
  exhibitionHistory: Exhibition[] = [];

  newExhibition: Exhibition = {
    title: "",
    year: "",
    venue: "",
    isSolo: false
  };

  showNewArtworkForm: boolean = false;
  artworks: Artwork[] = [];

  newArtwork: Artwork = {
    title: "",
    year: "",
    dimensions: "",
    askingPrice: "",
    imageUrl: ""
  };

  constructor(private route: ActivatedRoute, private authService: AuthService, private zone: NgZone) { }

  ngOnInit() {

    this.authService.getCustomerInfo().subscribe(data => {
      this.customer = data.user;

      this.fullName = data.user.fullName;
      this.facebookUrl = data.user.facbookUrl;
      this.twitterUrl = data.user.twitterUrl;
      this.instagramUrl = data.user.instagramUrl;
      this.bio = data.user.bio;

      if(data.user.exhibitionHistory) {
        this.exhibitionHistory = data.user.exhibitionHistory;
      }

      if(data.user.artworks) {
        this.artworks = data.user.artworks;
      }

      console.log(this.customer);
    });
  }

  changeProfile() {
    document.getElementById('fileInputProfile').click();
  }

  changeCover() {
    document.getElementById('fileInputCover').click();
  }

  onProfileChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.profileFile = file;

    this.authService.updateCustomerProfilePic(file).subscribe(data => {
      console.log(data);
      
      // this.zone.run(() => {
      //   this.customer = data.customer;
      // });
      
      this.authService.getCustomerInfo().subscribe(data => {
        this.customer = data.user;
        this.authService.updateSendBirdUser(this.customer.profileImageUrl);
      });
    });

  }

  onCoverChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.profileFile = file;

    this.authService.updateCustomerCoverPic(file).subscribe(data => {
      console.log(data);
      
      // this.zone.run(() => {
      //   this.customer = data.customer;
      // });
      
      this.authService.getCustomerInfo().subscribe(data => {
        this.customer = data.user;
      });
    });

  }

  onArtworkChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.newArtwork.file = file;
  }

  onEditFields() {
    this.fullName = this.customer.fullName;
    this.facebookUrl = this.customer.facebookUrl;
    this.twitterUrl = this.customer.twitterUrl;
    this.instagramUrl = this.customer.instagramUrl;
    this.bio = this.customer.bio;
    $('#newFieldsModal').modal('show');
  }

  addExhibition() {
    $('#newExhibitionModal').modal('show');
  }

  addArtwork() {
    $('#newArtworkModal').modal('show');
    //this.showNewArtworkForm = true;
  }

  saveExhibition() {
    console.log('new Exhibition: ', this.newExhibition);
    
    //this.showNewExhibitionForm = false;
    $('#newExhibitionModal').modal('hide');

    this.authService.uploadExhibition(this.newExhibition.title, this.newExhibition.year, this.newExhibition.venue).subscribe(data => {
      console.log(data);

      //this.exhibitionHistory.push(this.newExhibition);

      this.newExhibition = {
        title: "",
        year: "",
        venue: "",
        isSolo: false
      };

      this.authService.getCustomerInfo().subscribe(data => {
        //this.customer = data.user;

        if(data.user.exhibitionHistory) {
          this.exhibitionHistory = data.user.exhibitionHistory;
        }
      });
    });

    
  }

  deleteExhibition(id: string) {
    this.authService.deleteExhibition(id).subscribe(data => {
      console.log(data);

      if(data.success == true) {
        for(var i = 0; i < this.exhibitionHistory.length; i++) {
          if(this.exhibitionHistory[i]._id == id) {
            this.exhibitionHistory.splice(i, 1);
          }
        }
      }

    });
  }

  saveArtwork() {
    //this.showNewArtworkForm = false;
    $('#newArtworkModal').modal('hide');
    this.authService.uploadNewArtwork(this.newArtwork.file, this.newArtwork.title, this.newArtwork.year, this.newArtwork.dimensions ,this.newArtwork.askingPrice).subscribe(data => {
      console.log(data);

      
      //this.artworks = data.customer.artworks;

      this.newArtwork = {
        title: "",
        year: "",
        askingPrice: "",
        imageUrl: ""
      }

      this.authService.getCustomerInfo().subscribe(data => {
        //this.customer = data.user;

        if(data.user.artworks) {
          this.artworks = data.user.artworks;
        }
      });

    });
  }

  deleteArtwork(id: string) {
    console.log('_id: ', id);

    this.authService.deleteArtwork(id).subscribe(data => {
      console.log(data);

      if(data.success == true) {
        for(var i = 0; i < this.artworks.length; i++) {
          if(this.artworks[i]._id == id) {
            this.artworks.splice(i, 1);
          }
        }
      }

    });

  }

  saveFields() {

    const body = {
      fullName: this.fullName,
      facebookUrl: this.facebookUrl,
      twitterUrl: this.twitterUrl,
      instagramUrl: this.instagramUrl,
      bio: this.bio
    }

    $('#newFieldsModal').modal('hide');

    this.authService.updateCustomerInfo(body).subscribe(data => {
      console.log(data);

      this.customer.fullName = this.fullName;
      this.customer.facebookUrl = this.facebookUrl;
      this.customer.twitterUrl = this.twitterUrl;
      this.customer.instagramUrl = this.instagramUrl;
      this.customer.bio = this.bio;

      localStorage.setItem('fullName', this.fullName);

      this.authService.updateSendBirdUser(this.customer.profileImageUrl);
      
    })

  }

}
