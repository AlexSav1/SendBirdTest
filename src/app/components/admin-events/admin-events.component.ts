import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

import { Event } from '../../models/Event';

@Component({
  selector: 'app-admin-events',
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css']
})
export class AdminEventsComponent implements OnInit {

  events: Event[];
  memberEvents: Event[] = [];
  publicEvents: Event[] = [];

  constructor(private authService: AuthService, public adminService: AdminService, private router: Router) { }

  ngOnInit() {
    this.authService.getEvents().subscribe(eventJson => {
      console.log('event JSON' ,eventJson);
      
      if(eventJson) {
        this.events = eventJson;
        this.events.reverse();

        for(let event of this.events) {
          if(event.memberOnly == true) {
            this.memberEvents.unshift(event);
          } else {
            this.publicEvents.unshift(event);
          }
        }

      }

    });
  }

  onNewEvent(event: Event) {
    this.events.unshift(event);

    if(event.memberOnly == true) {
      this.memberEvents.unshift(event);
    } else {
      this.publicEvents.unshift(event);
    }

  }

  deleteEvent(event: Event) {
    console.log('event', event);
    this.adminService.deleteEvent(event._id).subscribe(data => {
      if(data.success) {

        if(event.memberOnly == true) {
          this.memberEvents.forEach((current, index) => {
            if(event._id === current._id) {
              this.memberEvents.splice(index, 1);
            }
          });
        } else {
          this.publicEvents.forEach((current, index) => {
            if(event._id === current._id) {
              this.publicEvents.splice(index, 1);
            }
          });
        }

      } else {
        console.log(data.error);
      }
    });
  }

  editEvent(event: Event) {
    // this.authService.editEvent(event).subscribe(data => {

    // });
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin']);
  }

}
