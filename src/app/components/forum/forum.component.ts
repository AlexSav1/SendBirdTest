import { Component, OnInit, NgZone } from '@angular/core';

import { AuthService } from '../../services/auth.service';

import { OpenChannel } from '../../models/OpenChannel';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  newThreadName: string = "";

  threads: OpenChannel[];

  constructor(private authService: AuthService, private zone: NgZone) { }

  ngOnInit() {

    // const userId = localStorage.getItem('userId');

    // if(!userId) {
    //   return;
    // }

    // if(this.authService.sb.getConnectionState() == 'OPEN') {
    //   console.log('OPEN');
    //   this.pullThreads();
    // } else {
    //   console.log('observable...');
    //   this.authService.connectionStatus().subscribe(value => {
    //     console.log('value: ', value)
    //     if(value == true) {
    //       this.pullThreads();
    //     }
    //   });
    // }

  }

  pullThreads() {
    console.log('pullThreads()');
    // var openChannelListQuery = this.authService.sb.OpenChannel.createOpenChannelListQuery();

    // openChannelListQuery.next((channels, error) => {
    //     if (error) {
    //         console.log('error: ', error);
    //         return;
    //     }

    //     console.log('channels: ', channels);
    //     this.threads = channels;
              
    // });
  }

  createNewThread() {

    // this.authService.sb.OpenChannel.createChannel(this.newThreadName, "", "", function(createdChannel, error) {
    //   if (error) {
    //       console.error('error: ', error);
    //       return;
    //   }
  
    //   // onCreated
    //   console.log('channel: ', createdChannel);
      
    // });
    this.newThreadName = "";
  }

}
