import { TestBed } from '@angular/core/testing';

import { DetailsSiteService } from '../details-site/details-site.service';

describe('DetailsSiteService', () => {
  let service: DetailsSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
