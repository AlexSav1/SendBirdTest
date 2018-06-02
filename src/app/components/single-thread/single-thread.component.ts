import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-single-thread',
  templateUrl: './single-thread.component.html',
  styleUrls: ['./single-thread.component.css']
})
export class SingleThreadComponent implements OnInit {

  channelUrl: string;
  newMessage: string;

  channel: any;
  messages: any[];

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    const channelUrl = this.route.snapshot.paramMap.get('url');

    this.channelUrl = channelUrl;

    // if(this.authService.sb.getConnectionState() == 'OPEN') {
    //   console.log('OPEN');
    //   this.joinChannel();
    // } else {
      
    //   this.authService.connectionStatus().subscribe(value => {
    //     console.log('observable callback');
    //     if(value == true) {
    //       this.joinChannel();
    //     }
    //   });
    // }

  }

  joinChannel() {
    // this.authService.sb.OpenChannel.getChannel(this.channelUrl, (channel, error) => {
    //   if (error) {
    //       console.error(error);
    //       return;
    //   }

    //   this.channel = channel;
  
    //   channel.enter((response, error) => {
    //       if (error) {
    //           console.error(error);
    //           return;
    //       }

    //       console.log('response: ', response);

    //       this.pullOldMessages();
    //   });

    // });
  }

  pullOldMessages() {
    // var messageListQuery = this.channel.createPreviousMessageListQuery();

    // messageListQuery.load(30, true, (messageList, error) => {
    //     if (error) {
    //         console.error(error);
    //         return;
    //     }
    //     console.log('messageList: ', messageList);
    //     this.messages = messageList;
    //     this.formatAllMessageDates();
    // });
  }

  onNewMessage() {
    console.log(this.newMessage);

    this.channel.sendUserMessage(this.newMessage, null, null, (message, error) => {
      if (error) {
          console.error(error);
          return;
      }
  
      // onSent
      console.log('sent message: ', message);

      this.formatMessageDate(message);
      this.messages.unshift(message);

    });
  }

  formatMessageDate(message: any) {
    const date = new Date(message.createdAt).toDateString();
    message.date = date;
  }

  formatAllMessageDates() {
    for(let message of this.messages) {
      const date = new Date(message.createdAt).toDateString();
      message.date = date;
    }
  }

}
