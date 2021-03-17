import { PlayList } from './../../models/playlist.model';
import { SpotifyService } from 'src/app/services/spotify.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-playlists',
  templateUrl: './user-playlists.component.html',
  styleUrls: ['./user-playlists.component.scss'],
})
export class UserPlaylistsComponent implements OnInit {
  playlists: PlayList[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    if (!this.spotifyService.isLogedIn()) {
      //TODO redirect login
    }
    this.spotifyService.getPlaylists().subscribe(
      (playlists) => (this.playlists = playlists),
      (error) => {
        console.error(error);
        // TODO implement error message
      }
    );
  }
}
