import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { ArtistDetailsComponent } from './artist-details/artist-details.component';
import { CompareComponent } from './compare/compare.component';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  {path:"home",component:TopArtistsComponent},
  {path:"details/:mbidParam", component: ArtistDetailsComponent},
  {path:"compare",component:CompareComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
