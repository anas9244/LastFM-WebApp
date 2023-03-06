import { Component, ViewChild } from '@angular/core';
import { ArtistDetailsComponent } from '../artist-details/artist-details.component';

interface ArtistData {
  mbid: string;
  side: string;
}
@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent {
  @ViewChild('left_details') leftDetails!: ArtistDetailsComponent;
  @ViewChild('right_details') rightDetails!: ArtistDetailsComponent;
  // componentName = 'CompareComponent';
  artistData!: ArtistData;

  onDataReceived(artistData: ArtistData) {
    this.artistData = artistData;
    if (artistData.side=="left"){
      this.leftDetails._fetchDetails(artistData.mbid)
    }
    if (artistData.side=="right"){
      this.rightDetails._fetchDetails(artistData.mbid)
    }

  }

  

}
