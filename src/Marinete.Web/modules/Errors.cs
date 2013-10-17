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
                    var appName = (string)_.appName;
                    var term = (string)Request.Query["query"];

                    int page;
                    const int size = 10;

                    if (!int.TryParse(Request.Query["page"], out page))
                        page = 1;

                    RavenQueryStatistics stats;

                    IEnumerable<UniqueMessageIndex.UniqueError> errors;
                    IEnumerable<string> sugestions = new List<string>();

                    if (!string.IsNullOrWhiteSpace(term))
                    {
                        var query = _documentSession
                            .Query<UniqueMessageIndex.UniqueError, UniqueMessageIndex>().Statistics(out stats)
                            .Search(c => c.Exception, term, 10);
                        
                        sugestions = query.Suggest().Suggestions.Where(c=> !c.Equals(term, StringComparison.InvariantCultureIgnoreCase)).ToList();

                        errors = query
                            .Search(c => c.AppName, appName, options: SearchOptions.And)
                            .OrderByDescending(c => c.CreatedAt)
                            .Skip((page - 1 > 0 ? page - 1 : 0)*size)
                            .Take(size)
                            .ToList();
                    }
                    else
                    {
                        errors = _documentSession
                            .Query<UniqueMessageIndex.UniqueError, UniqueMessageIndex>().Statistics(out stats)
                            .Search(c => c.AppName, appName)
                            .OrderByDescending(c => c.CreatedAt)
                            .Skip((page - 1 > 0 ? page - 1 : 0)*size)
                            .Take(size)
                            .ToList();
                    }


                    return Response.AsJson(new PagedResultsWithSugestions<UniqueMessageIndex.UniqueError>(errors, 
                        stats.TotalResults, 
                        page, 
                        size, 
                        sugestions));
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
}