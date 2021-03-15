import {Component, OnInit} from '@angular/core';
import {HttpService} from './services/http.service';
import {catchError, map, tap} from 'rxjs/operators';
import {WebsocketService} from './services/websocket.service';
import {Router, RouterStateSnapshot} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{


  hideform = false;
  title = 'BattleShipUi';
  username = '';
  roomname = '';
  roomcreator = '';
  roomparticipants = [];
  matchplayer1 = '';
  matchplayer2 = '';
  matchauthorized = 'false';
  passcode = '';

  authorizetext = 'Authorize';

  p1notready = true;
  p2notready = true;


  constructor(
    private httpService: HttpService,
    private webSocketService: WebsocketService
  ) {
  }

  ngOnInit(): void {
    const urlstring = window.location.href;
    const url = new URL(urlstring);
    this.username = url.searchParams.get('username');
    this.passcode = url.searchParams.get('passcode');
    this.roomname = url.searchParams.get('roomname');
    this.requestToJoinRoom();
  }

  joinRoom(): void {
    // joinroom(username, roomname, passcode)
    this.requestToJoinRoom();
  }

  requestToJoinRoom(): void {
    this.httpService.joinroom(this.username, this.roomname, this.passcode).subscribe(value => {
      console.log(value);
      this.httpService.getroom(this.roomname).subscribe(value1 => {
        console.log(value1);
        this.roomparticipants = value1.participants;
        this.roomcreator =  value1.roomcreator;
        this.matchplayer1 = value1.player1;
        this.matchplayer2 = value1.player2;
        this.matchauthorized = value1.matchauthorized;
        if ( this.matchauthorized === 'true'){
          this.authorizetext = 'Unauthorize';
        }else{
          this.authorizetext = 'Authorize';
        }
        console.log(this.roomcreator);
        this.hideform = true;
        this.connectws();
      });
    });
  }

  createRoom(): void {
    this.httpService.createroom(this.username, this.roomname, this.passcode).subscribe(value => {
      this.hideform = true;
      this.roomcreator = this.username;
      this.roomparticipants.push(this.roomcreator);
      this.connectws();
    });
  }

  iscreator(user): boolean {
    return user.equal(this.roomcreator);
  }

  matchplayer(u: string): void {
    if (this.username !== this.roomcreator){
      return;
    }
    if ( u === this.matchplayer1 || u === this.matchplayer2)
    { return; }
    if ( this.matchplayer1 === ''){
      this.matchplayer1 = u;
    }else if ( this.matchplayer2 === ''){
      this.matchplayer2 = u;
    }else{
      console.log('No Room for new Players');
    }
    this.updateplayers();
  }

  unmatchplayer1(): void {
    if (this.username !== this.roomcreator){
      return;
    }
    if (this.matchplayer1 === ''){return; }
    this.matchplayer1 = '';
    this.updateplayers();
  }

  unmatchplayer2(): void {
    if (this.username !== this.roomcreator){
      return;
    }
    if (this.matchplayer2 === ''){return; }
    this.matchplayer2 = '';
    this.updateplayers();
  }

  authorize(): void {
    if (this.username !== this.roomcreator){
      return;
    }
    if ( this.matchauthorized === 'true'){
      this.authorizetext = 'Unauthorize';
      this.matchauthorized = 'false';
    }else{
      this.authorizetext = 'Authorize';
      this.matchauthorized = 'true';
    }
    this.httpService.matchauth(this.roomname, this.username, this.matchplayer1, this.matchplayer2, this.matchauthorized)
      .subscribe(value => {
      console.log('authorized successfully');
    });
  }

  spectate(): void {

  }

  gameon(): void {
    if (this.username === this.matchplayer1 || this.username === this.matchplayer2) {
      this.httpService.playerready(this.roomname, this.username).subscribe(value => {
        console.log(value);
      });
    }
  }

  startgame(): void{
    // if ( this.username === this.matchplayer1 || this.username === this.matchplayer2 ){
    if ( true){
// tslint:disable-next-line:max-line-length
//       const url = `http://192.168.1.103:8000/static/BattleShip.html?username=${this.username}&roomname=${this.roomname}&passcode=${this.passcode}&player1=${this.matchplayer1}&player2=${this.matchplayer2}`;
// tslint:disable-next-line:max-line-length
      const url = `https://sockettesting12531.herokuapp.com/static/BattleShip.html?username=${this.username}&roomname=${this.roomname}&passcode=${this.passcode}&player1=${this.matchplayer1}&player2=${this.matchplayer2}`;
      console.log('SHEFSLDJFKSJLF');
      window.location.href = url;
    }else{
      return;
    }
  }

  updateplayers(): void {
    this.p1notready = true;
    this.p2notready = true;
    this.httpService.updateplayers(this.roomname, this.username, this.matchplayer1, this.matchplayer2).subscribe(value => {
      console.log('players updated');
    });
  }

  testWs(): void {
    this.webSocketService.subject.next({name : 'Chempa Francis', age : 32, task: 'test'});
  }

  connectws(): void {
    this.webSocketService.configure(this.roomname + '/' + this.username);
    this.webSocketService.subject.subscribe(
      msg => {
        const task = msg.task;
        const data = msg.data;
        this.processwstask(task, data);
      },
      error => {
        console.log(error);
        console.log('ERROR');
      }
    );
  }

  private processwstask(task: string, data: any): void {
    if ( task === 'updateplayers'){
      this.p1notready = true;
      this.p2notready = true;
      this.matchplayer1 = data.player1;
      this.matchplayer2 = data.player2;
    }else if ( task === 'newjoiner' ){
      this.roomparticipants.push(data.username);
    }else if ( task === 'playerready'){
      console.log('Player Ready !!!');
      let count = 0;
      if ( data.player1Ready === 1) {
        this.p1notready = false;
        count += 1;
      }else{
        this.p1notready = true;
      }
      if ( data.player2Ready === 1) {
        this.p2notready = false;
        count += 1;
      }else{
        this.p2notready = true;
      }
      if ( count === 2){
        console.log('Starting Game');
        this.startgame();
      }
    }
  }
}
