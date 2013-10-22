namespace Marinete.Web.Queries
{
    public interface IQuery<out TResult>
    {
        TResult Execute();
    }
}