import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

import { Poll } from '../../models/Poll';
import { PollChoice } from '../../models/PollChoice';

declare var $: any;

@Component({
  selector: 'app-admin-poll-form',
  templateUrl: './admin-poll-form.component.html',
  styleUrls: ['./admin-poll-form.component.css']
})
export class AdminPollFormComponent implements OnInit {

  title: string;

  newChoice: PollChoice = {
    title: "",
    description: ""
  };

  choices: PollChoice[] = [];

  @Output() newPoll: EventEmitter<Poll> = new EventEmitter();

  constructor(private adminService: AdminService, private authService: AuthService) { }

  ngOnInit() {
  }

  showChoiceModal() {
    $('#newChoiceModal').modal('show');
  }

  saveChoice() {
    console.log('New Choice: ', this.newChoice);
    this.choices.unshift(this.newChoice);

    this.newChoice = {
        title: "",
        description: ""
    }

    $('#newChoiceModal').modal('hide');
  }

  uploadPoll() {

    this.adminService.uploadPoll(this.title, this.choices).subscribe(data => {
      console.log(data);

      if(data.success == true) {
        this.newPoll.emit(data.doc);

        this.title = "";
        this.choices = [];
      }

    });

  }

}
