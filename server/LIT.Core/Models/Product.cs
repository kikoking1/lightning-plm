using System.ComponentModel.DataAnnotations.Schema;

namespace LIT.Core.Models;

public class Product
{
    public int? Id { get; set; }
    public string Name { get; set; }
    [ForeignKey("User")]
    public int? UserId { get; set; }

    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
}