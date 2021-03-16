import { Observable, of } from 'rxjs';

export class SpotifyServiceStub {
  constructor() {}

  isLogedIn(): boolean {
    return true;
  }

  generateURL(): string {
    return 'http://www.example.com/';
  }

  getTokens(): Observable<Object> {
    return of({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
    });
  }

  storeTokens(tokensObject: any) {
    localStorage.setItem('access_token', tokensObject.access_token);
    localStorage.setItem('refresh_token', tokensObject.refresh_token);
  }
}
