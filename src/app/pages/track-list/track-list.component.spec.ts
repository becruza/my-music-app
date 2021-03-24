import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SpotifyService } from 'src/app/services/spotify.service';
import { spotifyResponses } from 'src/app/__mocks__/spotify-responses';

import { TrackListComponent } from './track-list.component';

describe('TrackListComponent', () => {
  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;

  beforeEach(async () => {
    const spotifyServiceSpy = jasmine.createSpyObj('SpotifyService', [
      'getPlaylist',
      'getFavoritesList',
    ]);
    spotifyServiceSpy.getPlaylist.and.returnValue(of(spotifyResponses.top50));
    await TestBed.configureTestingModule({
      declarations: [TrackListComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifyServiceSpy },
        { provide: ActivatedRoute },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set platlist and tracks to top50', () => {
    component.showPlaylist('id');
    const playlistProperties = Object.keys(component.playlist!).sort();
    const playlistExpectedProperties = [
      'description',
      'id',
      'imageUrl',
      'name',
      'songsTotal',
      'spotifyWeb',
      'tracks',
    ];
    expect(playlistProperties).toEqual(playlistExpectedProperties);
    expect(component.tracks.length).toBe(50);
    const trackProperties = Object.keys(component.tracks).sort();
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
