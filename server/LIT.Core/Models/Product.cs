using System.ComponentModel.DataAnnotations.Schema;

namespace LIT.Core.Models;

public class Product
{
    public Guid? Id { get; set; }
    public string Name { get; set; }
    [ForeignKey("User")]
    public Guid? UserId { get; set; }

    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}