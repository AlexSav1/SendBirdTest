import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { Artist } from '../../models/Artist';

import { Customer } from '../../models/Customer';
import { Artwork } from '../../models/Artwork';
import { Exhibition } from '../../models/Exhibition';

declare var $: any;

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artist: Customer;
  artworks: Artwork[];
  exhibitionHistory: Exhibition[];

  fullScreenImageUrl: string;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    

    this.authService.getSpecificCustomer(id).subscribe(artistJson => {
      console.log('artist json: ', artistJson);
      this.artist = artistJson[0];

      if(artistJson[0].artworks) {
        this.artworks = artistJson[0].artworks;
      }

      if(artistJson[0].exhibitionHistory) {
        this.exhibitionHistory = artistJson[0].exhibitionHistory;
      }

    });

  }

  fullScreen(imageUrl: string) {
    this.fullScreenImageUrl = imageUrl;

    $('#fullScreenModal').modal('show');
  }

}
