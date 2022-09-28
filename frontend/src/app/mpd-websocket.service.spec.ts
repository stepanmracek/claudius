import { TestBed } from '@angular/core/testing';

import { MpdWebsocketService } from './mpd-websocket.service';

describe('MpdWebsocketService', () => {
  let service: MpdWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MpdWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
