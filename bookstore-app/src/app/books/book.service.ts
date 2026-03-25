import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map,switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  category: string;
  year: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {
private apiUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}


  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }


  getByIsbn(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${isbn}`).pipe(
      catchError(this.handleError)
    );
  }


  add(book: Book): Observable<Book> {
    return this.getAll().pipe(
      map(books => {
        const exists = books.find(b => b.isbn === book.isbn);
        if (exists) {
          this.toastr.error(`Book with ISBN ${book.isbn} already exists.`, 'Failed');
          throw new Error(`Duplicate ISBN ${book.isbn}`);
        }
        return book;
      }),
      switchMap(() => this.http.post<Book>(this.apiUrl, book)),
      catchError(this.handleError)
    );
  }


  update(book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}`, book).pipe(
      catchError(this.handleError)
    );
  }


  delete(isbn: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${isbn}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse) {
    console.error('BookService error:', err);
    let msg = 'An unknown error occurred';
    if (err.error instanceof ErrorEvent) {
      msg = `Error: ${err.error.message}`;
    } else if (err.status) {
      msg = `Server returned code ${err.status}, message: ${err.message}`;
    }
    this.toastr.error(msg, 'Failed');
    return throwError(() => new Error(msg));
  }
}