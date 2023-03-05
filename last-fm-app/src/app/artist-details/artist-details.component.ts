import { HttpClient } from '@angular/common/http';
import { Component, Input, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import ImagesModule from '../images/images.module';
import { LastfmService } from '../lastfm.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})

export class ArtistDetailsComponent {
  fetchedArtist!: any;
  mbid!: string;
  topTracks!: any[];
  topAlbums!: any[];
  variableValue!: string;
  myParam!: any;
  loading = false;
  imgFiles!: string[];


  @Input() parentComponentName!: string;

  constructor(private route: ActivatedRoute, private lastfmService: LastfmService, private http: HttpClient, private imageModule: ImagesModule) {
    this.imgFiles = imageModule.imageFiles;
  }

  ngOnInit() {
    this.fetchDetails()
  }
  fetchDetails() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.myParam = params.get('variableValue');
      this.loading = true;
      this.mbid = this.myParam;
      this.fetchedArtist = null;

      this.lastfmService.getArtistInfo(this.mbid).subscribe(response => {
        this.fetchedArtist = response.artist;
      });
      this.lastfmService.getTopTracks(this.mbid).subscribe(response => {
        this.topTracks = response.toptracks.track;
      });
      this.lastfmService.getTopAlbums(this.mbid).subscribe(response => {
        this.topAlbums = response.topalbums.album;
        this.loading = false;
      });

    });
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

  getImageUrl(artist: any, imgSizeIndex: number): string {
    const baseUrl = "assets/images/";
    if (this.imgFiles.includes(artist.mbid)) {
      return baseUrl + artist.mbid + ".jpg";
    }
    else
      return artist && artist.image && artist.image[imgSizeIndex] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }

}
