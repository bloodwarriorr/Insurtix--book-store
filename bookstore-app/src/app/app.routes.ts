import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookFormComponent } from './books/book-form/book-form.component';

export const routes: Routes = [
 { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'books/create', component: BookFormComponent },
  { path: 'books/edit/:isbn', component: BookFormComponent },
];