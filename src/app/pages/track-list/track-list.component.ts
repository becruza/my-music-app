import { SpotifyService } from 'src/app/services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { PlayList } from './../../models/playlist.model';
import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/models/track.model';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
})
export class TrackListComponent implements OnInit {
  playlist?: PlayList;
  tracks: Track[] = [];
  headerTrack: any = {
    album: 'Album',
    duration: 'Duration',
    name: 'Name',
  };

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    if (!this.spotifyService.isLogedIn()) {
      window.location.href = '/';
    }
    this.route.paramMap.subscribe((params) => {
      if (!params.get('id')) {
        return;
      }

      if (params.get('id') === 'favorites') {
        this.showFavorites();
      } else if (params.get('id') === 'top') {
        const top50Tracks = '37i9dQZEVXbMDoHDwVN2tF';
        this.showPlaylist(top50Tracks);
      } else {
        this.showPlaylist(params.get('id') as string);
      }
    });
  }

  showFavorites(): void {
    this.spotifyService.getFavoritesList().subscribe((trackList) => {
      if (trackList.length) {
        this.tracks = trackList;
      }
      this.playlist = {
        description: 'Here you can find your favorites songs!',
        id: 'favorites',
        name: 'Liked Songs',
        songsTotal: this.tracks.length,
        spotifyWeb: 'https://open.spotify.com/collection/tracks',
        tracks: [],
      };
    });
  }

  showPlaylist(id: string) {
    this.spotifyService.getPlaylist(id).subscribe((playlist) => {
      this.playlist = playlist;
      if (!playlist.tracks) {
        // TODO no tracks messages
      } else {
        this.tracks = playlist.tracks;
      }
    });
  }
}
