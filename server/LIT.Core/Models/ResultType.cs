namespace LIT.Core.Models;

public class ResultType<T>
{
    public int StatusCode { get; set; }
    public T? Data { get; set; }
    public APIError? ErrorMessage { get; set; }
}