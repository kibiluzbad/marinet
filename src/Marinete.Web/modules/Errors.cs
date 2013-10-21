using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Indexes;
using Marinete.Web.Security;
using Marinete.Web.models;
using Nancy;
using Nancy.ModelBinding;
using Nancy.Security;
using Raven.Client;
using Raven.Client.Linq;

namespace Marinete.Web.modules
{
    public class Errors : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Errors(IDocumentSession documentSession)
        {
            this.RequiresAuthentication();

            _documentSession = documentSession;

            After += ctx => _documentSession.SaveChanges();

            Get["/errors/{appName}"] = _ =>
            {
                var appName = (string) _.appName;
                var term = (string) Request.Query["query"];

                int page;
                const int size = 10;

                if (!int.TryParse(Request.Query["page"], out page))
                    page = 1;

                return Response.AsJson(new AppErrorsQuery(_documentSession)
                {
                    AppName = appName,
                    Page = page,
                    Size = size,
                    Term = term
                }.Execute());
            };

            Get["/error/{id}"] = _ =>
                {
                    var id = (string) _.id;

                    var error = _documentSession.Load<Error>("errors/" + id);

                    return Response.AsJson(new
                        {
                            error.Exception,
                            error.Message,
                            error.OsVersion,
                            error.Platform,
                            error.Processors,
                            error.ServicePack,
                            error.AppName,
                            error.CreatedAt,
                            error.CurrentUser
                        });
                };

            Post["/error/{id}/comment"] = _ => 
                {
                    var user = GetUser();
                    if (null == user) return HttpStatusCode.NotFound;

                    var id = (string)_.id;
                    var error = _documentSession.Load<Error>("errors/" + id);
                    if (null == error) return HttpStatusCode.NotFound;

                    var comment = this.Bind<CommentCreateModel>();
                    error.AddComment(comment.Message, user.Id);

                    return HttpStatusCode.OK;
                };
        }

        private MarinetUser GetUser() {
            var user = _documentSession.Query<MarinetUser>()
                                       .FirstOrDefault(c => c.UserName == Context.CurrentUser.UserName);

            return user;
        }
    }

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

    public interface IQuery<out TResult>
    {
        TResult Execute();
    }
}