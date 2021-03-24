import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Track } from '../models/track.model';
import { PlayList } from '../models/playlist.model';
import { User } from '../models/user.model';

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

  private authHeader(): string {
    return `Basic ${btoa(this.clientID + ':' + this.clientSecret)}`;
  }

  private tokenAuthHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  private formatDuration(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = (milliseconds % 60000) / 1000;
    return `${minutes}: ${(seconds < 10 ? '0' : '') + seconds.toFixed(0)}`;
  }

  private jsonToTrack(trackData: any): Track {
    return {
      addedAt: new Date(trackData.added_at),
      album: trackData.track.album.name,
      artists: trackData.track.artists.map((artist: any) => artist.name),
      duration: this.formatDuration(trackData.track.duration_ms),
      id: trackData.track.id,
      name: trackData.track.name,
      spotifyWeb: trackData.track.external_urls.spotify,
    } as Track;
  }

  private jsonToPlaylist(playlistData: any): PlayList {
    const tracks: Track[] = [];
    if (playlistData.tracks.items && playlistData.tracks.total > 0) {
      playlistData.tracks.items.forEach((trackData: any) => {
        tracks.push(this.jsonToTrack(trackData));
      });
    }
    return {
      description: playlistData.description,
      spotifyWeb: playlistData.external_urls.spotify,
      id: playlistData.id,
      imageUrl: playlistData.images[0] ? playlistData.images[0].url : null,
      name: playlistData.name,
      songsTotal: playlistData.tracks.total,
      tracks: tracks.length > 0 ? tracks : null,
    } as PlayList;
  }

  generateAuthURL(): string {
    this.scopes = 'playlist-read-private user-library-read user-library-modify';
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

  getTokens(code: string): Observable<any> {
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectURL}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: this.authHeader(),
      }),
    };
    return this.http.post(this.tokensEndpoint, encodeURI(body), options);
  }

  storeTokens(tokensObject: any): void {
    localStorage.setItem('access_token', tokensObject.access_token);
    localStorage.setItem('refresh_token', tokensObject.refresh_token);
  }

  deleteTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isLogedIn(): boolean {
    return localStorage.getItem('access_token') &&
      localStorage.getItem('refresh_token')
      ? true
      : false;
  }

  getPlaylist(playlistId: string): Observable<PlayList> {
    const playlistEndpoint = `https://api.spotify.com/v1/playlists/${playlistId}`;
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.get(playlistEndpoint, options).pipe(
      map(this.jsonToPlaylist.bind(this)),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of({} as PlayList);
      })
    );
  }

  getAllPlaylists(): Observable<PlayList[]> {
    const playlistsEndpoint = 'https://api.spotify.com/v1/me/playlists';
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.get(playlistsEndpoint, options).pipe(
      map((data: any) => data.items),
      map((items) => {
        const playlists: PlayList[] = [];
        items.forEach((playlistData: any) => {
          const playlist = this.jsonToPlaylist(playlistData);
          playlists.push(playlist);
        });
        return playlists;
      }),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of([]);
      })
    );
  }

  getFavoritesList(): Observable<Track[]> {
    const favoritesEndpoint = 'https://api.spotify.com/v1/me/tracks';
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.get(favoritesEndpoint, options).pipe(
      map((data: any) => {
        const favoriteTracks: Track[] = [];
        data.items.forEach((trackData: any) => {
          favoriteTracks.push(this.jsonToTrack.call(this, trackData));
        });
        return favoriteTracks;
      }),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of([]);
      })
    );
  }

  checkFavoriteTrack(id: string): Observable<any> {
    const checkFavoritesEndpoint = `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`;
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.get(checkFavoritesEndpoint, options).pipe(
      map((data: any) => {
        return data[0];
      }),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of('Something went wrong, try later.');
      })
    );
  }

  addTrackToFavorites(id: string): Observable<any> {
    const saveFavoritesEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${id}`;
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.put(saveFavoritesEndpoint, {}, options).pipe(
      map(() => `The track with id ${id} was added to Favorites List`),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of('Something went wrong adding thre track, try later.');
      })
    );
  }

  removeTrackFromFavorites(id: string): Observable<any> {
    const removeFavoritesEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${id}`;
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.delete(removeFavoritesEndpoint, options).pipe(
      map(() => `The track with id ${id} was removed from Favorites List`),
      catchError((err) => {
        console.error(err.message || err.toString());
        return of('Something went wrong removing the track, try later.');
      })
    );
  }

  getUserInfo(): Observable<User> {
    const userInfoEndpoint = 'https://api.spotify.com/v1/me';
    const options = {
      headers: new HttpHeaders({ Authorization: this.tokenAuthHeader() }),
    };
    return this.http.get(userInfoEndpoint, options).pipe(
      map((data: any) => {
        const userInfo: User = {
          displayName: data.display_name,
          spotifyUrl: data.external_urls.spotify,
        };
        return userInfo;
      }),
      catchError((err) => {
        console.error(err.message || err.toString());
        const userInfo: User = {
          displayName: 'User',
          spotifyUrl: 'https://open.spotify.com/',
        };
        return of(userInfo);
      })
    );
  }
}
