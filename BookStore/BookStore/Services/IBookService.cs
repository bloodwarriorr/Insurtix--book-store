using BookStore.Models;

namespace BookStore.Services
{
    public interface IBookService
    {
        List<Book> GetAll();
        void AddBook(Book book);
        void UpdateBook(Book updated);
        void DeleteBook(string isbn);
        string GenerateHtmlReport();
    }
}
