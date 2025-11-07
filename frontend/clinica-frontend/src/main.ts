import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { mergeApplicationConfig } from '@angular/core';

const mergedConfig = mergeApplicationConfig(appConfig, {
  providers: [provideHttpClient(withInterceptorsFromDi())],
});

bootstrapApplication(App, mergedConfig)
  .catch(err => console.error(err));
