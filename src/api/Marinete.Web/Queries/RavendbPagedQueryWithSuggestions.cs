using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Web.Models;
using Raven.Client;
using Raven.Client.Linq;

namespace Marinete.Web.Queries
{
    public abstract class RavendbPagedQueryWithSuggestions<TResult>
        : IQuery<PagedResultsWithSuggestions<TResult>>
    {
        protected IDocumentSession Session { get; set; }
        protected IEnumerable<string> Suggestions;

        public virtual int Page { get; set; }
        public virtual int Size { get; set; }
        public virtual string Term { get; set; }

        protected RavendbPagedQueryWithSuggestions(IDocumentSession session)
        {
            Session = session;
        }

        public virtual PagedResultsWithSuggestions<TResult> Execute()
        {
            var query = GetQuery();

            RavenQueryStatistics stats;

            query.Statistics(out stats);

            return new PagedResultsWithSuggestions<TResult>(query.Skip(SkipPages())
                .Take(Size)
                .ToList(),
                stats.TotalResults,
                Page,
                Size,
                Suggestions);
        }

        protected virtual IRavenQueryable<TResult> GetQuery()
        {
            IRavenQueryable<TResult> query = CreateQuery();
            
            LoadSuggestions(query);

            query = ApplyFilter(query);

            return query;
        }

        protected abstract IRavenQueryable<TResult> ApplyFilter(IRavenQueryable<TResult> query);

        protected virtual void LoadSuggestions(IRavenQueryable<TResult> query)
        {
            if (string.IsNullOrWhiteSpace(Term)) return;
            Suggestions =
                query.Suggest().Suggestions.Where(c => !c.Equals(Term, StringComparison.InvariantCultureIgnoreCase)).ToList();
        }

        protected abstract IRavenQueryable<TResult> CreateQuery();

        protected virtual int SkipPages()
        {
            return GetPage() * Size;
        }

        protected virtual int GetPage()
        {
            return Page - 1 > 0 
                ? Page - 1 
                : 0;
        }
    }
}