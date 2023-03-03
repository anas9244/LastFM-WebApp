import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LastfmService } from '../lastfm.service';
import { Router } from '@angular/router';
import ImagesModule from '../images/images.module';

interface Countries {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {

  constructor(private lastfmService: LastfmService, private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef, private imageModule: ImagesModule) {
    this.imgFiles = imageModule.imageFiles;
  }

  countries: Countries[] = [
    { value: 'germany', viewValue: 'Germany' },
    { value: 'spain', viewValue: 'Spain' },
    { value: 'italy', viewValue: 'Italy' },
  ];

  topArtists!: any;
  // selectedCountry='germany';
  countryControl = new FormControl(this.countries[0].value);
  loading = false;
  imgFiles!: string[];

  ngOnInit() {
    this._getTopArtists();
  }

  _getTopArtists() {
    this.loading = true;
    this.topArtists = null;
    this.lastfmService.getTopArtists(this.countryControl.value as any).subscribe(
      response => {
        this.topArtists = response.topartists.artist.filter((artist: { mbid: any; }) => artist.mbid);
        this.loading = false;
      }
      , error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  getViewValue(selectedCountry: FormControl) {
    const selectedViewValue = this.countries.find(option => option.value === selectedCountry.value);
    // console.log(selectedViewValue?.viewValue)
    return selectedViewValue?.viewValue;
  }

  getImageUrl(artist: any, imgSizeIndex: number): string {
    const baseUrl = "assets/images/";
    if (this.imgFiles.includes(artist.mbid)) {
      return baseUrl + artist.mbid + ".jpg";
    }
    else 
    return artist && artist.image && artist.image[imgSizeIndex] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }

  nFormatter(num: string, digits: number) {
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
    var item = lookup.slice().reverse().find(function (item) {
      return +num >= item.value;
    });
    return item ? (+num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  navigateToComponent(variableValue: string) {
    this.router.navigate(['/details', variableValue]);
  }

}
