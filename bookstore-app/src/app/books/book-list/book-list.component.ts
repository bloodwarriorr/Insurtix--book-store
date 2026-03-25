import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html'
})
export class BookListComponent {
  private service = inject(BookService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  books = signal<Book[]>([]);

  constructor() {
    this.loadBooks();
  }
  loadBooks() {
    this.service.getAll().subscribe(data => this.books.set(data));
  }
  edit(_book: Book) {
    this.router.navigate(['/books/edit', _book.isbn], {
      state: { book: _book }
    });
  }

delete(isbn: string) {
    if (confirm('Are you sure?')) {
      this.service.delete(isbn).subscribe({
        next: () => {
          this.books.update(current => current.filter(b => b.isbn !== isbn));
          this.toastr.success('The book was deleted successfully!', 'Success');
        },
        error: (err) => console.error(err)
      });
    }
  }
  downloadHtmlReport() {
    const url = `${environment.apiUrl}/books/html-report`;

    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'books-report.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: (err) => {
        console.error('Failed to download HTML report:', err);
        alert('Error downloading report.');
      }
    });
  }
}
