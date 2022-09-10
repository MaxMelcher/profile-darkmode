import { TestBed } from '@angular/core/testing';

import { ApplicationInsightsService } from './application-insights.service';

describe('ApplicationInsightsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationInsightsService = TestBed.get(ApplicationInsightsService);
    expect(service).toBeTruthy();
  });
});
