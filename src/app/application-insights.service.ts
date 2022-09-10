import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {

  private routerSubscription: Subscription;

  // @todo config needs to be injected
  private appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: '6f6549c2-926e-4b19-b01c-b34e85e7b780'
    }
  });

  constructor(instrumentationKey: string, enabled: boolean) {
    if (instrumentationKey && enabled) {
      this.appInsights.loadAppInsights();
      this.appInsights.config.instrumentationKey = instrumentationKey;
    }
  }

  logPageView(name: string, url?: string, properties?: any, measurements?: any, duration?: number) {
    this.appInsights.trackPageView({
      uri: url,
      name: name,
      measurements: measurements
    });
  }
}
