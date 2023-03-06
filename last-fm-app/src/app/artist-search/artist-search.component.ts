import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LastfmService } from '../lastfm.service';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import ImagesModule from '../images/images.module';
import { ConnectionService } from 'ng-connection-service';

interface ParentComponentData {
  parent: string;
  side: string;
}

interface SentArtistData {
  mbid: string;
  side: string;
}
@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.css']
})

export class ArtistSearchComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;

  
  @Input() parentComponentData!: ParentComponentData;
  @Output() artistEmitter = new EventEmitter<SentArtistData>();

  artistControl = new FormControl();
  mbid!: string;
  image!: string;
  images: string[] = [];
  filteredArtists!: Observable<any[]>;
  loading = false;
  imgFiles!: string[];

  constructor(private lastfmService: LastfmService, private http: HttpClient, private router: Router, private imageModule: ImagesModule, private connectionService: ConnectionService) {
    this.imgFiles = imageModule.imageFiles;
  }

  ngOnInit() {
    console.log(this.parentComponentData);

    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.search();
      }
    });
  }

  search() {
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

  getImageUrl(artist: any, imgSizeIndex: number): string {
    const baseUrl = "assets/images/";
    if (this.imgFiles.includes(artist.mbid)) {
      return baseUrl + artist.mbid + ".jpg";
    }
    else
      return artist && artist.image && artist.image[imgSizeIndex] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
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

  navigateToDetails(artistMbid: string) {
    if (this.parentComponentData.parent=="compare")
      this.artistEmitter.emit({mbid:artistMbid, side: this.parentComponentData.side});
    else
      this.router.navigate(['/details', artistMbid]);
      
  }

}