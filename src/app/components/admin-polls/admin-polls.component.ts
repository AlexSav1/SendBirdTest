import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Poll } from '../../models/Poll';

import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-polls',
  templateUrl: './admin-polls.component.html',
  styleUrls: ['./admin-polls.component.css']
})
export class AdminPollsComponent implements OnInit {

  polls: Poll[];

  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.authService.getPolls().subscribe(data => {
      console.log(data);
      this.polls = data;
    });

  }

  onNewPoll(poll: Poll) {
    this.polls.unshift(poll);
  }

  deletePoll(poll: Poll) {
    this.adminService.deletePoll(poll._id).subscribe(data => {
      console.log(data);

      if(data.success == true) {
        this.polls.forEach((current, index) => {
          if(poll._id === current._id) {
            this.polls.splice(index, 1);
          }
        });
      }

    });
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin']);
  }

}
