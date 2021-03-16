import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private authorizeEndpoint = 'https://accounts.spotify.com/authorize';
  private tokensEndpoint = 'https://accounts.spotify.com/api/token';
  private clientID = '11ea5759d6764d50851f1e9d0f2e708a';
  private clientSecret = '8855420b8c6143da881d248a44eee85d';
  private redirectURL = 'http://127.0.0.1:4200/';
  private scopes?: string;

  constructor(private http: HttpClient) {}
  // constructor() {}

  generateURL(): string {
    return (
      this.authorizeEndpoint +
      '?response_type=code' +
      '&client_id=' +
      this.clientID +
      (this.scopes ? '&scope=' + encodeURIComponent(this.scopes) : '') +
      '&redirect_uri=' +
      encodeURIComponent(this.redirectURL)
    );
  }

  getTokens(code: string) {
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectURL}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(this.clientID + ':' + this.clientSecret)}`,
      }),
    };
    return this.http.post(this.tokensEndpoint, encodeURI(body), options);
  }

  storeTokens(tokensObject: any): void {
    localStorage.setItem('access_token', tokensObject.access_token);
    localStorage.setItem('refresh_token', tokensObject.refresh_token);
  }

  isLogedIn(): boolean {
    return localStorage.getItem('access_token') &&
      localStorage.getItem('refresh_token')
      ? true
      : false;
  }
}
