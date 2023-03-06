import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LastfmService } from '../lastfm.service';
import { Router } from '@angular/router';
import ImagesModule from '../images/images.module';
import { ConnectionService } from 'ng-connection-service';

interface Countries {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent {

  constructor(private lastfmService: LastfmService, private http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef, private imageModule: ImagesModule, private connectionService: ConnectionService) {
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
  myArray: number[] = Array.from({ length: 10 }, (_, i) => i);
  online!: boolean;

  checkConnection() {
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.online = true;
      }
      else {
        this.online = false;
        // this.loading = true;
      }
    });

  }

  ngOnInit() {
    this.checkConnection();

    this._getTopArtists();

  }

  _getTopArtists() {
    if (this.online) {
      this.loading = true;
      this.topArtists = null;
      this.lastfmService.getTopArtists(this.countryControl.value as any).subscribe(
        response => {
          this.topArtists = response.topartists.artist.filter((artist: { mbid: any; }) => artist.mbid);
          this.loading = false;
        }
        , error => {
          this.loading = true;
          console.log(error);
        }
      );
    }
    else this.online = true;

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

  addCommas(num: number): string {
    const strNumber = num.toString();
    const chars = strNumber.split('');
    const reversedChars = chars.reverse();
    const groupedDigits: string[] = [];
    for (let i = 0; i < reversedChars.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        groupedDigits.push(',');
      }
      groupedDigits.push(reversedChars[i]);
    }
    // Reverse the array again and join it into a string
    const result = groupedDigits.reverse().join('');
    return result;
  }

  navigateToComponent(mbidParam: string) {
    this.router.navigate(['/details', mbidParam]);
  }

}
