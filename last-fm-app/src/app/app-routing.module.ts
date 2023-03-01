import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';

const routes: Routes = [
  {path:"home",component:TopArtistsComponent},
  {path:"details", component: ArtistDetailsComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
