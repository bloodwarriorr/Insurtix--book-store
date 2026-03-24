namespace BookStore.Services
{
    using Models;
    using System.Text;
    using System.Web;
    using System.Xml.Linq;

    public class BookService : IBookService
    {
        private readonly string _xmlPath;
        private XDocument _xml;
        private readonly ILogger<BookService> _logger;
        private static readonly object _fileLock = new object();

        public BookService(IConfiguration config, ILogger<BookService> logger, IWebHostEnvironment env)
        {
            _logger = logger;

            _xmlPath = GetXmlFilePath(config, env);

            EnsureFileExists(env);

            _xml = LoadXmlDocument();
        }
        private string GetXmlFilePath(IConfiguration config, IWebHostEnvironment env)
        {
            string dbFolder = config.GetValue<string>("DbFolder") ?? "App_Data";
            var fileName = config.GetValue<string>("XmlFileName") ?? "bookstore.xml";
            return Path.Combine(env.ContentRootPath, dbFolder, fileName);
        }

        private void EnsureFileExists(IWebHostEnvironment env)
        {
            var directory = Path.GetDirectoryName(_xmlPath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory!);
            }
            //Make sure to fetch data from seed data if the application is on first deployment and the XML file doesn't exist yet
            if (!File.Exists(_xmlPath))
            {
                string seedPath = Path.Combine(env.ContentRootPath, "Data_Seed", "seed_data.xml");
                if (File.Exists(seedPath))
                {
                    File.Copy(seedPath, _xmlPath);
                    _logger.LogInformation("Seed data copied to: {Path}", _xmlPath);
                }
                else
                {
                    new XDocument(new XElement("bookstore")).Save(_xmlPath);
                    _logger.LogWarning("Seed file not found. Created empty XML at: {Path}", _xmlPath);
                }
            }
        }

        private XDocument LoadXmlDocument()
        {
            try
            {
                _logger.LogInformation("*** Library System is using XML at: {Path} ***", _xmlPath);
                return XDocument.Load(_xmlPath);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to load XML at: {_xmlPath}", ex);
            }
        }
        public List<Book> GetAll()
        {
            return _xml.Root.Elements("book").Select(x => new Book
            {
                Isbn = (string)x.Element("isbn"),
                Title = (string)x.Element("title"),
                Authors = x.Elements("author").Select(a => (string)a).ToList(),
                Category = (string)x.Attribute("category"),
                Year = (int)x.Element("year"),
                Price = (decimal)x.Element("price")
            }).ToList();
        }

        public void AddBook(Book book)
        {
            lock (_fileLock)
            {
                if (_xml.Root.Elements("book").Any(x => (string)x.Element("isbn") == book.Isbn))
                    throw new InvalidOperationException($"A book with ISBN {book.Isbn} already exists.");

                var newElem = new XElement("book",
                    new XAttribute("category", book.Category),
                    new XElement("isbn", book.Isbn),
                    new XElement("title", book.Title),
                    book.Authors.Select(a => new XElement("author", a)),
                    new XElement("year", book.Year),
                    new XElement("price", book.Price)
                );

                _xml.Root.Add(newElem);
                SaveXml();
            }
        }

        public void UpdateBook(Book updated)
        {
            lock (_fileLock)
            {
                var bookElem = _xml.Root.Elements("book").FirstOrDefault(x => (string)x.Element("isbn") == updated.Isbn);
                if (bookElem == null)
                    throw new InvalidOperationException($"Book with ISBN {updated.Isbn} not found.");

                // מחליף את הערכים
                bookElem.SetElementValue("title", updated.Title);
                bookElem.Elements("author").Remove();
                foreach (var a in updated.Authors)
                {
                    bookElem.Add(new XElement("author", a));
                }
                bookElem.SetAttributeValue("category", updated.Category);
                bookElem.SetElementValue("year", updated.Year);
                bookElem.SetElementValue("price", updated.Price);

                SaveXml();
            }
        }

        public void DeleteBook(string isbn)
        {
            lock (_fileLock)
            {
                var bookElem = _xml.Root.Elements("book").FirstOrDefault(x => (string)x.Element("isbn") == isbn);
                if (bookElem == null)
                    throw new InvalidOperationException($"Book with ISBN {isbn} not found.");

                bookElem.Remove();

                SaveXml();
            }
        }
        private void SaveXml()
        {
            try
            {
                _xml.Save(_xmlPath);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to save XML file: {_xmlPath}. {ex.Message}");
            }
        }

        public string GenerateHtmlReport()
        {
            var books = GetAll();
            var sb = new StringBuilder();
            sb.Append("<h2>Bookstore Inventory Report</h2>");
            sb.Append("<table border='1'><tr><th>Title</th><th>Authors</th><th>Category</th><th>Year</th><th>Price</th></tr>");
            foreach (var b in books)
            {
                sb.Append($"<tr><td>{HttpUtility.HtmlEncode(b.Title)}</td>" +
           $"<td>{HttpUtility.HtmlEncode(string.Join(", ", b.Authors))}</td>" +
           $"<td>{b.Category}</td>" +
           $"<td>{b.Year}</td>" +
           $"<td>{b.Price}</td></tr>");
            }
            sb.Append("</table>");
            return sb.ToString();
        }
    }
}
