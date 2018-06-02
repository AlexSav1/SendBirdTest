import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AdminService } from '../../services/admin.service';

import { Event } from '../../models/Event';

@Component({
  selector: 'app-admin-event-form',
  templateUrl: './admin-event-form.component.html',
  styleUrls: ['./admin-event-form.component.css']
})
export class AdminEventFormComponent implements OnInit {

  title: string;
  onView: string;
  bio: string;
  galleryParty: string;
  memberOnly: boolean = false;
  file: File;

  @Output() newEvent: EventEmitter<Event> = new EventEmitter();

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  onChange(event) {
    var file = event.srcElement.files[0];
    console.log(file);
    this.file = file;
  }

  onSubmit() {
    if(!this.file || !this.title || !this.onView || !this.bio || !this.galleryParty) {
      alert('please fill out completely');
      return;
    }

    this.adminService.uploadEvent(this.file, this.title, this.onView, this.bio, this.galleryParty, this.memberOnly).subscribe(data => {
      console.log(data);

      if(data.success) {
        alert('successfully uploaded event!');

        const newEvent: Event = data.doc;
        console.log('newEvent', newEvent);

        this.newEvent.emit(newEvent);

        this.title = null;
        this.bio = null;
        this.onView = null;
        this.galleryParty = null;
        this.memberOnly = false;

      } else {
        alert('an error occured');
      }
    });
  }

}
