import { PlayList } from './../models/playlist.model';
import { Observable, of } from 'rxjs';
import { SpotifyService } from './spotify.service';

describe('SpotifyLoginService', () => {
  let spotifyService: SpotifyService;
  let httpClientSpy: { get: jasmine.Spy; post: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    spotifyService = new SpotifyService(httpClientSpy as any);
  });

  it('should return the authorization url', () => {
    const authUrl =
      'https://accounts.spotify.com/authorize?response_type=code&client_id=11ea5759d6764d50851f1e9d0f2e708a&scope=playlist-read-private&redirect_uri=' +
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

  it('should return false', () => {
    expect(spotifyService.isLogedIn()).toBeFalse();
  });

  it('should return an array of playlists', () => {
    const spotifyResponse = {
      items: [
        {
          description: '',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/37O2zfsSaal22unocnWXfL',
          },
          id: '37O2zfsSaal22unocnWXfL',
          images: [],
          name: 'My Playlist #4',
          tracks: {
            total: 0,
          },
        },
        {
          description: '',
          external_urls: {
            spotify: 'https://open.spotify.com/playlist/1mVlouS1mEbKNctPcDez78',
          },
          id: '1mVlouS1mEbKNctPcDez78',
          images: [
            {
              url:
                'https://i.scdn.co/image/ab67616d0000b273cf84c5b276431b473e924802',
            },
          ],
          name: 'My Playlist #3',
          tracks: {
            total: 1,
          },
        },
      ],
    };
    httpClientSpy.get.and.returnValue(of(spotifyResponse));
    spotifyService.getPlaylists().subscribe((data) => {
      expect(data.length).toBe(2);
      const properties = Object.keys(data[0]).sort();
      const expectedProperties = [
        'description',
        'id',
        'imageUrl',
        'name',
        'songsTotal',
        'spotifyWeb',
      ];
      expect(properties).toEqual(expectedProperties);
    });
  });
});
