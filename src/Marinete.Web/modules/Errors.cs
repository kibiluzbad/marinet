using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Indexes;
using Marinete.Web.models;
using Nancy;
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

                    if (!string.IsNullOrWhiteSpace(term))
                    {
                        errors = _documentSession
                            .Query<UniqueMessageIndex.UniqueError, UniqueMessageIndex>().Statistics(out stats)
                            .Search(c => c.Exception, term, 10)
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


                    return  Response.AsJson(new PagedResult<UniqueMessageIndex.UniqueError>(errors, 
                        stats.TotalResults, 
                        page, 
                        size));
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
        }
    }
}