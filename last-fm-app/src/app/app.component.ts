import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'last-fm-app';
}


// import { Component } from '@angular/core';
// import { LastfmService } from './lastfm.service';

// @Component({
//   selector: 'app-root',
//   template: `
//     <h1>Search for artists on Last.fm</h1>
//     <input type="text" [(ngModel)]="searchQuery">
//     <button (click)="search()">Search</button>
//     <ul>
//       <li *ngFor="let artist of searchResults">{{ artist.name }}</li>
//     </ul>
//   `
// })
// export class AppComponent {
//   searchQuery = '';
//   searchResults: any[] = [];

//   constructor(private lastfmService: LastfmService) { }

//   search() {
//     this.lastfmService.searchArtists(this.searchQuery)
//       .subscribe(data => {
//         this.searchResults = data.results.artistmatches.artist;
//       });
//   }
// }
