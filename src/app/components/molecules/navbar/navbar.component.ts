import { SpotifyService } from './../../../services/spotify.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userInfo?: User;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.spotifyService.isLogedIn();
    if (this.isLoggedIn) {
      this.spotifyService
        .getUserInfo()
        .subscribe((userInfo) => (this.userInfo = userInfo));
    }
  }

  signOut(): void {
    this.spotifyService.deleteTokens();
    window.location.href = '/';
  }
}
