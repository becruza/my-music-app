import { PlayList } from './../../../models/playlist.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-preview',
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.scss'],
})
export class ListPreviewComponent {
  @Input() playlist?: PlayList;
  constructor() {}
}
