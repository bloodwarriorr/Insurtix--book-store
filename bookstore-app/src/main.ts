import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import { provideToastr } from 'ngx-toastr'; 
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    provideHttpClient(),
    provideAnimationsAsync(), 
    provideToastr({           
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    })
  ]
}).catch((err) => console.error(err));