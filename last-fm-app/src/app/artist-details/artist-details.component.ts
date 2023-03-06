import { HttpClient } from '@angular/common/http';
import { Component, Input, QueryList, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import ImagesModule from '../images/images.module';
import { LastfmService } from '../lastfm.service';

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
  fetchedArtist!: any;
  // mbid!: string;
  topTracks!: any[];
  topAlbums!: any[];
  variableValue!: string;
  myParam!: any;
  loading = false;
  imgFiles!: string[];

  @ViewChildren('imageContainerChild') imageContainerChild!: QueryList<ElementRef>;;
  @ViewChildren('listsContainer') listContainer!: QueryList<ElementRef>;;
  @ViewChildren('bottomlLeft') bottomlLeft!: QueryList<ElementRef>;;


  // @Input() parentComponentName!: string;
  @Input() parentComponentData!: ParentComponentData;


  constructor(private route: ActivatedRoute, private lastfmService: LastfmService, private http: HttpClient, private imageModule: ImagesModule, private renderer: Renderer2) {
    this.imgFiles = imageModule.imageFiles;
  }
  ngAfterViewInit() {
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



    // this.renderer.setStyle(afterImage, 'border-radius', '20px 20px 0 0');
  }

  ngOnInit() {
    this.fetchDetails();
  }
  fetchDetails() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.myParam = params.get('variableValue');

      // this.mbid = this.myParam;
      if (this.myParam) {
        this._fetchDetails(this.myParam);
      }

    });
  }


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
