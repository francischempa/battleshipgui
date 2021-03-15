import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';



@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  subject = null;
  configure(path): void{
    // this.subject = webSocket('ws://192.168.1.103:8000/' + path);
    this.subject = webSocket('wss://sockettesting12531.herokuapp.com/' + path);
  }
}
