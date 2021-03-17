import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private spotifyService: SpotifyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.spotifyService.isLogedIn()) {
      this.router.navigate(['/playlists']);
    }
    this.logIn();
  }

  logIn(): void {
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('code')) {
        this.spotifyService.getTokens(params.get('code')!).subscribe(
          (tokens) => {
            this.spotifyService.storeTokens(tokens);
            this.router.navigate(['/playlists']);
          },
          (error) => {
            console.error(error);
            // TODO implements error message
          }
        );
      }
    });
  }

  spotifyLogin(): void {
    const url = this.spotifyService.generateAuthURL();
    window.location.href = url;
  }
}
