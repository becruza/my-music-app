import { Component, Input, OnInit } from '@angular/core';
import { Track } from 'src/app/models/track.model';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss'],
})
export class TrackInfoComponent {
  @Input() track?: Track;

  constructor(private spotifyService: SpotifyService) {}

  saveToFavorites(id: string): void {
    this.spotifyService.checkFavoriteTrack(id).subscribe((response) => {
      if (response) {
        this.spotifyService.removeTrackFromFavorites(id).subscribe(console.log); //TODO Show message to user
      } else {
        this.spotifyService.addTrackToFavorites(id).subscribe(console.log); //TODO Show message to user
      }
    });
  }
}
