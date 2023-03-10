import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LastfmService {
  private baseUrl = 'https://ws.audioscrobbler.com/2.0/';
  private apiKey = '6601c59abbea9b2c4b8c12adb2c5913c'; // Replace with your Last.fm API key

  constructor(private http: HttpClient) { }

  searchArtists(query: string): Observable<any> {
    const url = `${this.baseUrl}?method=artist.search&artist=${query}&api_key=${this.apiKey}&format=json&limit=7`;
    return this.http.get<any>(url);
  }

  getTopArtists(country: string, options?: any): Observable<any> {
    const url = `${this.baseUrl}?method=geo.gettopartists&country=${country}&api_key=${this.apiKey}&limit=10&format=json`;
    return this.http.get<any>(url);
  }

  getArtistInfo(mbid: string): Observable<any> {
    const url = `${this.baseUrl}?method=artist.getinfo&mbid=${mbid}&api_key=${this.apiKey}&format=json`;
    return this.http.get<any>(url);
  }

  //https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&mbid=bfcc6d75-a6a5-4bc6-8282-47aec8531818&limit=5&api_key=6601c59abbea9b2c4b8c12adb2c5913c&format=json

  getTopTracks(mbid: string): Observable<any> {
    const url = `${this.baseUrl}?method=artist.gettoptracks&mbid=${mbid}&limit=5&api_key=${this.apiKey}&format=json`;
    return this.http.get<any>(url);
  }
  //https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=bfcc6d75-a6a5-4bc6-8282-47aec8531818&api_key=6601c59abbea9b2c4b8c12adb2c5913c&format=json

  getTopAlbums(mbid: string, options?: any): Observable<any> {
    const url = `${this.baseUrl}?method=artist.gettopalbums&mbid=${mbid}&limit=5&api_key=${this.apiKey}&format=json`;
    return this.http.get<any>(url);
  }
}