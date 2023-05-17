namespace LIT.Core.Models;

public class User
{
    public Guid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}