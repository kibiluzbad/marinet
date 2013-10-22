using Marinete.Web.Indexes;
using Raven.Client;
using Raven.Client.Linq;

namespace Marinete.Web.Queries
{
    public class AppErrorsQuery : RavendbPagedQueryWithSuggestions<UniqueMessageIndex.UniqueError>
    {
        public string AppName { get; set; }
        
        public AppErrorsQuery(IDocumentSession session) : base(session)
        { }

        protected override IRavenQueryable<UniqueMessageIndex.UniqueError> ApplyFilter(IRavenQueryable<UniqueMessageIndex.UniqueError> query)
        {
            return query
                .Search(c => c.AppName, AppName, options: SearchOptions.And)
                .OrderByDescending(c => c.CreatedAt);
        }

        protected override IRavenQueryable<UniqueMessageIndex.UniqueError> CreateQuery()
        {
            var query = Session.Query<UniqueMessageIndex.UniqueError, UniqueMessageIndex>();
            if (!string.IsNullOrWhiteSpace(Term))
                return query
                    .Search(c => c.Exception, Term, 10);
            return query;
        }
    }
}