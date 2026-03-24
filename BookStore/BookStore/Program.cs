using BookStore.Services;
var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;
// Add services to the container.
Console.WriteLine($"Current Env: {builder.Environment.EnvironmentName}");

var xmlPath = builder.Configuration.GetValue<string>("XmlPath");
Console.WriteLine($"Selected XML Path: {xmlPath}");
builder.Services.AddSingleton<IBookService, BookService>();
builder.Services.AddControllers();
builder.Services.AddCors(o => o.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddOpenApi();
var app = builder.Build();
app.UseCors("AllowAll");
app.MapControllers();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
