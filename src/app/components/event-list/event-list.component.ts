import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { Event } from '../../models/Event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Event[];
  publicEvents: Event[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {

    window.scrollTo(0, 0);
    
    this.authService.getEvents().subscribe(eventJson => {
      console.log('event JSON' ,eventJson);
      
      if(eventJson) {
        this.events = eventJson;
        this.events.reverse();

        for(let event of this.events) {
          if(!event.memberOnly) {
            this.publicEvents.unshift(event);
          }
        }
      }
    });

  }

}
