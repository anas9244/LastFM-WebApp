import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
