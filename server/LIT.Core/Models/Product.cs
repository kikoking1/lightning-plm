namespace LIT.Core.Models;

public class Product
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
    public Guid? UserId { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}