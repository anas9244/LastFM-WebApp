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

// to determine in which view (compare or details) this component is being used
interface ParentComponentData {
  parent: string;
  side: string;
}
// to send  the mbid of the chosen artist, and which side of the compare view was used
// only relevant when used in compare
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
  // obtain the autocomplete element, so that is can be closed input is cleared
  @ViewChild(MatAutocompleteTrigger) autoComplete!: MatAutocompleteTrigger;


  @Input() parentComponentData!: ParentComponentData;
  @Output() artistEmitter = new EventEmitter<SentArtistData>();

  artistControl = new FormControl(); // to store the search query
  mbid!: string; // mbid of artits 
  filteredArtists!: Observable<any[]>; // found artists
  loading = false; //toggle lading spinner
  imgFiles!: string[]; // list of local artits images 

  constructor(private lastfmService: LastfmService, private http: HttpClient, private router: Router, private imageModule: ImagesModule, private connectionService: ConnectionService) {
    this.imgFiles = imageModule.imageFiles;
  }

  ngOnInit() {

    // handle search attempt after connection has resumed 
    this.connectionService.monitor().subscribe(isConnected => {
      if (isConnected) {
        this.search();
      }
    });
  }
  /* perform artists search using the respective function from lastFm Service and store the found artists */
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
  // handle the chosen artist from autocomplete, for showing the name in the search field and to transfer the mbid
  selectArtist(artist: any) {
    this.mbid = artist.mbid;
    this.artistControl.setValue(artist.name);
    this.navigateToDetails(this.mbid);
  }
  // get the artists image given the fetched artist and the size of the image 
  getImageUrl(artist: any, imgSizeIndex: number): string {
    const baseUrl = "assets/images/";
    if (this.imgFiles.includes(artist.mbid)) {
      return baseUrl + artist.mbid + ".jpg";
    }
    else
      return artist && artist.image && artist.image[imgSizeIndex] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }
  // break down big numbers into commas ever thousand 
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
  // either send the mbid and side of search component to the respective details component  when used in compare 
  navigateToDetails(artistMbid: string) {
    if (this.parentComponentData.parent == "compare")
      this.artistEmitter.emit({ mbid: artistMbid, side: this.parentComponentData.side });
    else
      this.router.navigate(['/details', artistMbid]);
  }

}