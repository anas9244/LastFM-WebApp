import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Artist } from '../artist.model';
import { LastfmService } from '../lastfm.service';

interface Countries{
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {

  constructor(private lastfmService: LastfmService, private http: HttpClient) {}
  countries: Countries[]  = [
    {value: 'germany', viewValue: 'Germany'},
    {value: 'spain', viewValue: 'Spain'},
    {value: 'italy', viewValue: 'Italy'},
  ];
  result!: Observable<any> ;
  topArtists!: Observable<any> ;
  // selectedCountry='germany';
  countryControl= new FormControl(this.countries[0].value);

  getViewValue(selectedCountry: FormControl){
    const selectedViewValue = this.countries.find(option => option.value === selectedCountry.value);
    // console.log(selectedViewValue?.viewValue)
    return selectedViewValue?.viewValue;
  }

  _getTopArtists(){
    this.lastfmService.getTopArtists(this.countryControl.value as any).subscribe(
      artists => this.topArtists = new Observable<any[]>((observer) => {
        observer.next(artists.topartists.artist.filter((artist: { mbid: any; }) => artist.mbid));
      })
    );
  }

  ngOnInit() {
    this._getTopArtists();
  }

  getImageUrl(artist: Artist, imgSizeIndex: number): string {
    return artist && artist.image && artist.image[2] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }


}
