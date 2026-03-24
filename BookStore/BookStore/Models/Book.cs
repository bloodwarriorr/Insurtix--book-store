namespace BookStore.Models
{
    public class Book
    {
        public string Isbn { get; set; } = "";
        public string Title { get; set; } = "";
        public List<string> Authors { get; set; } = new();
        public string Category { get; set; } = "";
        public int Year { get; set; }
        public decimal Price { get; set; }
        public Book()
        {
                
        }
    }
}
