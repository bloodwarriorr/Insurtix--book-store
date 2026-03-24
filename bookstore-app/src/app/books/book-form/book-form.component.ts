import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { BookService } from '../book.service';


@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  errorMessage: string = '';
  isEdit: boolean = false;
  isbn!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService
  ) {}

  ngOnInit() {

  this.createBlankForm();

  const bookFromState = history.state?.book;

  if (bookFromState) {

    this.patchFormValues(bookFromState);
  } else {

    const isbnParam = this.route.snapshot.paramMap.get('isbn');
    
    if (isbnParam) {

      this.isbn = isbnParam;
      this.isEdit = true;
      this.loadBookFromServer(isbnParam);
    } else {
    
      this.isEdit = false;
      console.log('Mode: Add New Book');
    }
  }
}


private createBlankForm() {
  this.bookForm = this.fb.group({
    isbn: ['', Validators.required], 
    title: ['', Validators.required],
    authors: this.fb.array([this.fb.control('', Validators.required)]), 
    category: ['', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]]
  });
}


private patchFormValues(book: any) {
  this.isEdit = true;
  this.isbn = book.isbn;
  

  this.bookForm.patchValue({
    isbn: book.isbn,
    title: book.title,
    category: book.category,
    year: book.year,
    price: book.price
  });


  const authorControls = book.authors.map((a: string) => this.fb.control(a, Validators.required));
  this.bookForm.setControl('authors', this.fb.array(authorControls));
}

private loadBookFromServer(isbn: string) {
  this.bookService.getByIsbn(isbn).subscribe({
    next: (book) => {
      if (book) this.patchFormValues(book);
      else this.router.navigate(['/books']);
    },
    error: () => this.router.navigate(['/books'])
  });
  }


  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  addAuthor() {
    this.authors.push(this.fb.control('', Validators.required));
  }

  removeAuthor(index: number) {
    this.authors.removeAt(index);
  }

submit() {
  if (this.bookForm.invalid) return;

  const bookData = this.bookForm.value;

  const finalBook = { ...bookData, isbn: this.isEdit ? this.isbn : bookData.isbn };

  const request = this.isEdit 
    ? this.bookService.update(finalBook) 
    : this.bookService.add(finalBook); 

  request.subscribe({
    next: () => {
      alert(this.isEdit ? 'Updated!' : 'Added!');
      this.router.navigate(['/books']);
    },
    error: (err) => (this.errorMessage = 'Action failed.')
  });
}

  cancel() {
    this.router.navigate(['/books']);
  }
}