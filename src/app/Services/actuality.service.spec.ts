import { TestBed } from '@angular/core/testing';

import { ActualityService } from './actuality.service';

describe('ActualityService', () => {
  let service: ActualityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
