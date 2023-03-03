import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LastfmService } from '../lastfm.service';

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})

export class ArtistDetailsComponent {
  fetchedArtist!: any;
  mbid!:string;
  topTracks!:any[];
  topAlbums!:any[];
  variableValue!: string;
  myParam!:any;
  loading=false;

  @Input() parentComponentName!: string;

  constructor(private route: ActivatedRoute,private lastfmService: LastfmService) {}

  ngOnInit() {

    this.fetchDetails()

  }
  fetchDetails(){
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.myParam = params.get('variableValue');
      this.loading=true;
      this.mbid = this.myParam;
      this.fetchedArtist= null;
    
      this.lastfmService.getArtistInfo(this.mbid).subscribe(response => {
        this.fetchedArtist = response.artist;
       
      });
      this.lastfmService.getTopTracks(this.mbid).subscribe(response => {
        this.topTracks = response.toptracks.track;
        
      });
      this.lastfmService.getTopAlbums(this.mbid).subscribe(response => {
        this.topAlbums = response.topalbums.album;
        this.loading=false;
      });

    });
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

}
