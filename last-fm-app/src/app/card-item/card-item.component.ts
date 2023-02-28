import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Artist } from '../artist.model';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.css']
})
export class CardItemComponent {
  topArtists: Observable<Artist[]> = new Observable<Artist[]>;

  
}
