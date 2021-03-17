import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserPlaylistsComponent } from './pages/user-playlists/user-playlists.component';

const routes: Routes = [
  { path: 'playlists', component: UserPlaylistsComponent },
  { path: '', component: LoginComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
