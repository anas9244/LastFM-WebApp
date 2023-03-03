import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { Artist } from '../artist.model';
import { LastfmService } from '../lastfm.service';
import { Router } from '@angular/router';

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

  constructor(private lastfmService: LastfmService, private http: HttpClient,private router: Router) {}
  countries: Countries[]  = [
    {value: 'germany', viewValue: 'Germany'},
    {value: 'spain', viewValue: 'Spain'},
    {value: 'italy', viewValue: 'Italy'},
  ];
  result!: Observable<any> ;
  topArtists!: Observable<any> ;
  // selectedCountry='germany';
  countryControl= new FormControl(this.countries[0].value);
  loading=false;

  getViewValue(selectedCountry: FormControl){
    const selectedViewValue = this.countries.find(option => option.value === selectedCountry.value);
    // console.log(selectedViewValue?.viewValue)
    return selectedViewValue?.viewValue;
  }

  _getTopArtists(){
    this.topArtists= new Observable<any>;
    this.loading=true;
    this.lastfmService.getTopArtists(this.countryControl.value as any).subscribe(
      artists => this.topArtists = new Observable<any[]>((observer) => {
        observer.next(artists.topartists.artist.filter((artist: { mbid: any; }) => artist.mbid));
        this.loading=false;
      })
    );
  }

  ngOnInit() {
    
    this._getTopArtists();
    
  }

  getImageUrl(artist: Artist, imgSizeIndex: number): string {
    return artist && artist.image && artist.image[2] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }

  nFormatter(num: string, digits:number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return +num >= item.value;
    });
    return item ? (+num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  navigateToComponent(variableValue: string) {
    this.router.navigate(['/details', variableValue]);
  }


}
