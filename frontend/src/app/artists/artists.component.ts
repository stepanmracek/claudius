import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MpdRestService } from '../mpd-rest.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent {

  artists$: Observable<{ [key: string]: string[] }>

  constructor(private mpdRestService: MpdRestService, private router: Router) {
    this.artists$ = this.mpdRestService.getArtists().pipe(
      map((artists: string[]) => {
        artists.sort()
        let result: { [key: string]: string[] } = {}
        for (let artist of artists) {
          let letter = artist[0]
          if (result[letter] == undefined) {
            result[letter] = []
          }
          result[letter].push(artist)
        }
        return result
      })
    )
  }

  goTo(artist: string) {
    this.router.navigate(['artist-albums', artist])
  }

}
