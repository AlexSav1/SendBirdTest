import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  username: string;
  password: string;

  loggedIn: boolean = false;

  constructor(
    private router: Router,
    public adminService: AdminService
    //private flashMessages: FlashMessagesService
  ) { }

  ngOnInit() {
    //this.loggedIn = this.adminService.adminLoggedIn();
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    }

    if(this.username == undefined || this.password == undefined) {
      //alert('Please fill in all fields');
      alert('Please fill in all fields');
      //this.flashMessages.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.adminService.loginAdminUser(user).subscribe(data => {
      if(data.success) {
        localStorage.setItem('id_token', data.token);
        alert('You are logged in!');
        //this.flashMessages.show('You are logged in!', {cssClass: 'alert-success', timeout: 5000});
        //this.router.navigate(['/admin/events']);
      } else {
        alert(data.msg);
        //this.flashMessages.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        //this.router.navigate(['/login']);
      }
    });

  }

  logout() {
    this.adminService.logout();
  }

}
