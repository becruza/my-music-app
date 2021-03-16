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
    // private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('2 veces');

    if (this.spotifyService.isLogedIn()) {
      //TODO redirect to home page
      console.log('Logged In');
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      if (params.get('code')) {
        this.spotifyService
          .getTokens(params.get('code')!)
          .subscribe((tokens) => {
            this.spotifyService.storeTokens(tokens);
            // location.reload();
          });
      }
    });
  }

  spotifyLogin(): void {
    const url = this.spotifyService.generateURL();
    window.location.href = url;
  }
}
