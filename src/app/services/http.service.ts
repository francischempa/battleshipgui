import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  // BASEURL = 'http://192.168.1.103:8000';
  BASEURL = 'https://sockettesting12531.herokuapp.com';
  CREATEROOM = '/createroom';
  JOINROOM = '/joinroom';
  GETROOM = '/getroom';
  UPDATEPLAYERS = '/updateplayers';
  MATCHAUTH = '/matchauth';
  PLAYERREADY = '/playerready';

  constructor(private httpClient: HttpClient) { }
  public joinroom(username, roomname, passcode): Observable<any> {
    console.log(username);
    console.log(roomname);

    return this.httpClient
      .get<string>(this.BASEURL + this.JOINROOM, {params : new HttpParams().set('roomname', roomname).set('username', username).set('passcode', passcode)})
      .pipe(
        map(response => response)
      );
  }

  public createroom(username, roomname, passcode): Observable<any> {
    return this.httpClient
      .get<string>(this.BASEURL + this.CREATEROOM,
      { params : new HttpParams().set('roomname', roomname).set('username', username).set('passcode', passcode)})
      .pipe(map(response => response));
  }

  public getroom(roomname): Observable<any> {
    return this.httpClient
      .get<string>(this.BASEURL + this.GETROOM,
        { params : new HttpParams().set('roomname', roomname)})
      .pipe(map(response => response));
  }

  public updateplayers(roomname, username, player1, player2): Observable<any> {
    return this.httpClient
      .get<string>(this.BASEURL + this.UPDATEPLAYERS,
        { params : new HttpParams().set('roomname', roomname)
            .set('player1', player1).set('player2', player2).set('username', username)})
      .pipe(map(response => response));
  }


  public matchauth(roomname, username, player1, player2, authorized): Observable<any> {
    return this.httpClient
      .get<string>(this.BASEURL + this.MATCHAUTH,
        { params : new HttpParams().set('roomname', roomname)
            .set('player1', player1).set('player2', player2).set('authorized', authorized).set('username', username)})
      .pipe(map(response => response));
  }


  public playerready(roomname, username): Observable<any> {
    return this.httpClient
      .get<string>(this.BASEURL + this.PLAYERREADY,
        { params : new HttpParams().set('roomname', roomname)
            .set('username', username)})
      .pipe(map(response => response));
  }

}
