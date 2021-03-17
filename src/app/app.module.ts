import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogoComponent } from './components/atoms/logo/logo.component';
import { LoginComponent } from './pages/login/login.component';
import { ButtonComponent } from './components/atoms/button/button.component';
import { UserPlaylistsComponent } from './pages/user-playlists/user-playlists.component';
import { PlaylistCardComponent } from './components/molecules/playlist-card/playlist-card.component';

@NgModule({
  declarations: [AppComponent, LogoComponent, LoginComponent, ButtonComponent, UserPlaylistsComponent, PlaylistCardComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
