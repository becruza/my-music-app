import { of } from 'rxjs';
import { SpotifyService } from './spotify.service';
import { spotifyResponses } from './../__mocks__/spotify-responses';

describe('SpotifyLoginService', () => {
  let spotifyService: SpotifyService;
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    spotifyService = new SpotifyService(httpClientSpy as any);

    const store: any = {};
    spyOn(localStorage, 'getItem').and.callFake((key) => store[key]);
    spyOn(localStorage, 'setItem').and.callFake(
      (key, value) => (store[key] = '' + value)
    );
    spyOn(localStorage, 'removeItem').and.callFake((key) => delete store[key]);
  });

  it('should return the authorization url', () => {
    const scopes = encodeURIComponent(
      'playlist-read-private user-library-read user-library-modify'
    );
    const authUrl =
      `https://accounts.spotify.com/authorize?response_type=code&client_id=11ea5759d6764d50851f1e9d0f2e708a&scope=${scopes}&redirect_uri=` +
      encodeURIComponent('http://127.0.0.1:4200/');
    expect(spotifyService.generateAuthURL()).toBe(authUrl);
  });

  it('should return a json object with both acess_token and refresh_token', () => {
    const tokensObject = {
      access_token: 'my_access_token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'my_refresh_token',
      scope: 'playlist-read-private',
    };
    httpClientSpy.post.and.returnValue(of(tokensObject));
    spotifyService.getTokens('my-code').subscribe((tokens) => {
      const properties = Object.keys(tokens).sort();
      const expectedProperties = [
        'access_token',
        'expires_in',
        'refresh_token',
        'scope',
        'token_type',
      ];
      expect(properties).toEqual(expectedProperties);
    });
  });

  it('should save tokens in localStorage', () => {
    spotifyService.storeTokens({
      access_token: 'my_access_token',
      refresh_token: 'my_refresh_token',
    });
    expect(localStorage.getItem('access_token')).toBe('my_access_token');
    expect(localStorage.getItem('refresh_token')).toBe('my_refresh_token');
  });

  it('should delete tokens from localStorage', () => {
    spotifyService.deleteTokens();
    expect(localStorage.getItem('access_token')).toBeUndefined();
    expect(localStorage.getItem('refresh_token')).toBeUndefined();
  });

  it('should be loggedIn', () => {
    spotifyService.storeTokens({
      access_token: 'my_access_token',
      refresh_token: 'my_refresh_token',
    });
    expect(spotifyService.isLogedIn()).toBeTrue();
  });

  it('should return a single playlist', () => {
    const spotifyResponse = spotifyResponses.playlist;
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.getPlaylist('playlist_id').subscribe((data) => {
      const playlistProperties = Object.keys(data).sort();
      const expectedPlaylistProperties = [
        'description',
        'id',
        'imageUrl',
        'name',
        'songsTotal',
        'spotifyWeb',
        'tracks',
      ];
      expect(playlistProperties).toEqual(expectedPlaylistProperties);
    });
  });

  it('should return an array of playlists', () => {
    const spotifyResponse = spotifyResponses.playlists;
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.getAllPlaylists().subscribe((data) => {
      expect(data.length).toBe(2);
      const properties = Object.keys(data[0]).sort();
      const expectedProperties = [
        'description',
        'id',
        'imageUrl',
        'name',
        'songsTotal',
        'spotifyWeb',
        'tracks',
      ];
      expect(properties).toEqual(expectedProperties);
    });
  });

  it("should return an array of User's saved tracks", () => {
    const spotifyResponse = spotifyResponses.favorites;
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.getFavoritesList().subscribe((data) => {
      const trackProperties = Object.keys(data[0]).sort();
      const trackExpectedProperties = [
        'addedAt',
        'album',
        'artists',
        'duration',
        'id',
        'name',
        'spotifyWeb',
      ];
      expect(trackProperties).toEqual(trackExpectedProperties);
    });
  });

  it('should be in favorites', () => {
    const spotifyResponse = spotifyResponses.checkFavorite;
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.checkFavoriteTrack('track_id').subscribe((data) => {
      expect(data).toBeTrue();
    });
  });

  it('should add track to favorites', () => {
    httpClientSpy.put.and.returnValue(of({}));
    spotifyService.addTrackToFavorites('track_id').subscribe((result) => {
      expect(result).toBe(
        'The track with id track_id was added to Favorites List'
      );
    });
  });

  it('should remove track from favorites', () => {
    httpClientSpy.delete.and.returnValue(of({}));
    spotifyService.removeTrackFromFavorites('track_id').subscribe((result) => {
      expect(result).toBe(
        'The track with id track_id was removed from Favorites List'
      );
    });
  });

  it("should return User's info", () => {
    const spotifyResponse = spotifyResponses.user;
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.getUserInfo().subscribe((data) => {
      const userProperties = Object.keys(data).sort();
      const userExpectedProperties = ['displayName', 'spotifyUrl'];
      expect(userProperties).toEqual(userExpectedProperties);
    });
  });
});
