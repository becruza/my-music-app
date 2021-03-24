import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TrackListComponent } from './pages/track-list/track-list.component';
import { UserPlaylistsComponent } from './pages/user-playlists/user-playlists.component';

const routes: Routes = [
  { path: 'playlists/:id', component: TrackListComponent },
  { path: 'playlists', component: UserPlaylistsComponent },
  { path: 'home', redirectTo: 'playlists/top' },
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: '**', component: LoginComponent }, //TODO 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
