import { HttpClient } from '@angular/common/http';
import { Component, Input, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import ImagesModule from '../images/images.module';
import { LastfmService } from '../lastfm.service';

// to determine in which view (compare or details) this component is being used
interface ParentComponentData {
  parent: string;
  side: string;
}

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})

export class ArtistDetailsComponent {

  fetchedArtist!: any; // artists data
  topTracks!: any[]; //  the top tracks data
  topAlbums!: any[]; //  top artists data
  mbidParam!: any; //  the route parameter that holds the artists mbid
  loading = false; // to toggle loading spinner
  imgFiles!: string[]; // to store some local artists images for demo (since lastFm doesn't offer the actual artists images, only an image of a star)

  //for adapting the details component when used in compare component
  @ViewChildren('imageContainerChild') imageContainerChild!: QueryList<ElementRef>;
  @ViewChildren('listsContainer') listContainer!: QueryList<ElementRef>;
  @ViewChildren('bottomlLeft') bottomlLeft!: QueryList<ElementRef>;

  // to determine in which view (compare or details) this component is being used
  @Input() parentComponentData!: ParentComponentData;

  constructor(private route: ActivatedRoute, private lastfmService: LastfmService, private imageModule: ImagesModule, private renderer: Renderer2) {
    this.imgFiles = imageModule.imageFiles;
  }
  ngAfterViewInit() {
    // check if details component is being used in compare and adapt the view accordingly
    console.log(this.parentComponentData);
    if (this.parentComponentData.parent == "compare") {
      this.imageContainerChild.changes.subscribe(() => {
        this.imageContainerChild.first.nativeElement.style.width = "100%";
        this.imageContainerChild.first.nativeElement.style.height = "100%";
        this.renderer.setStyle(this.imageContainerChild.first.nativeElement, 'border-radius', '20px 20px 0 0');
      });
      this.listContainer.changes.subscribe(() => {
        this.renderer.setStyle(this.listContainer.first.nativeElement, 'flex-direction', 'column');
      });
      this.bottomlLeft.changes.subscribe(() => {
        this.renderer.setStyle(this.bottomlLeft.first.nativeElement, 'font-size', '33px');
      });
    }
  }

  ngOnInit() {
    // to check whether the route parameter for mbid has changed, thus the details component is routed from the main search component, not compare
    this.fetchDetailsMain();
  }

  fetchDetailsMain() { 
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.mbidParam = params.get('mbidParam');

      if (this.mbidParam) {
        // use the helper function with the mbid route param 
        this._fetchDetails(this.mbidParam);
      }

    });
  }

// helper function for fetching artists details with the given mbid. Also to use externally in the compare component
  _fetchDetails(mbid: string) {
    this.loading = true;
    this.fetchedArtist = null;
    this.lastfmService.getArtistInfo(mbid).subscribe(response => {
      this.fetchedArtist = response.artist;
    });
    this.lastfmService.getTopTracks(mbid).subscribe(response => {
      this.topTracks = response.toptracks.track;
    });
    this.lastfmService.getTopAlbums(mbid).subscribe(response => {
      this.topAlbums = response.topalbums.album;
      this.loading = false;
    });
  }

  addCommas(num: number): string { // break down big numbers into commas ever thousand 
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

  getImageUrl(artist: any, imgSizeIndex: number): string {// get the artists image given the fetched artist and the size of the image 
    const baseUrl = "assets/images/";
    // if found in the local image folder, use that
    if (this.imgFiles.includes(artist.mbid)) {
      return baseUrl + artist.mbid + ".jpg";
    }
    else
    // else use the one from lastFm (just an image of a star)
      return artist && artist.image && artist.image[imgSizeIndex] && (artist.image[imgSizeIndex] as any)["#text"] ? (artist.image[imgSizeIndex] as any)["#text"] : '';
  }

  // get the album image url given the fetched album and the size of the image 
  getAlbumImageUrl(album: any, imgSizeIndex: number): string {
    return album && album.image && album.image[imgSizeIndex] && (album.image[imgSizeIndex] as any)["#text"] ? (album.image[imgSizeIndex] as any)["#text"] : '';
  }

  // get the track image url given the fetched track and the size of the image 
  getTrackImageUrl(track: any, imgSizeIndex: number): string {
    return track && track.image && track.image[imgSizeIndex] && (track.image[imgSizeIndex] as any)["#text"] ? (track.image[imgSizeIndex] as any)["#text"] : '';
  }

}
