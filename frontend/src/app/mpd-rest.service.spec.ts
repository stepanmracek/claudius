import { TestBed } from '@angular/core/testing';

import { MpdRestService } from './mpd-rest.service';

describe('MpdRestService', () => {
  let service: MpdRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MpdRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
