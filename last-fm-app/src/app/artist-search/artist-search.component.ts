import { Component, OnInit, ViewChild } from '@angular/core';
import { LastfmService } from '../lastfm.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.css']
})
export class ArtistSearchComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;

  artistControl = new FormControl();
  mbid!: string;
  image!: string;
  images: string[] = [];
  filteredArtists!: Observable<any[]>;
  loading = false;

  constructor(private lastfmService: LastfmService, private http: HttpClient, private router: Router) { }

  ngOnInit() {

    this.filteredArtists = this.artistControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((inputValue: string) => {
          if (inputValue) {
            this.loading = true;
            return this.lastfmService.searchArtists(inputValue);
          } else {
            this.autoComplete.closePanel();
            return new Observable<any[]>;
          }
        }),
        switchMap((response) => {
          this.loading = false;
          return new Observable<any[]>((observer) => {
            observer.next(response.results.artistmatches.artist.filter((artist: { mbid: any; }) => artist.mbid));
          });
        })
      );
  }

  selectArtist(artist: any) {
    // this.selectedArtist = artist;
    this.mbid = artist.mbid;
    console.log(this.mbid);
    this.artistControl.setValue(artist.name);
    this.image = (artist.image[2] as any)["#text"]
    console.log(this.image);
    this.navigateToDetails(this.mbid);
  }

  getImageUrl(artist: any, imgSizeIndex: number) {

    return artist && artist.image && artist.image[2] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }
  fileExists(url: string) {
    return this.http.head(url).pipe(
      map(() => true), // If the request succeeds, the file exists
      catchError((error) => {
        console.log(`Error checking if ${url} exists: ${error}`);
        return of(false);
      }) // If the request fails, the file doesn't exist
    );
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

  navigateToDetails(variableValue: string) {
    this.router.navigate(['/details', variableValue]);
  }

}