import { PlayList } from './../../../models/playlist.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-card',
  templateUrl: './playlist-card.component.html',
  styleUrls: ['./playlist-card.component.scss'],
})
export class PlaylistCardComponent {
  @Input() playlistData?: PlayList;
  constructor() {}
}
