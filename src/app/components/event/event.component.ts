import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { Event } from '../../models/Event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: Event;

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.authService.getSpecificEvent(id).subscribe(eventJson => {
      console.log('eventJson: ', eventJson);
      this.event = eventJson[0];
    });
  }

}
