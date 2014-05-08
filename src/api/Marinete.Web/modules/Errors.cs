using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Indexes;
using Marinete.Web.Models;
using Marinete.Web.Queries;
using Marinete.Web.Security;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.ModelBinding;
using Nancy.Responses;
using Nancy.Security;
using Raven.Abstractions.Data;
using Raven.Client;

namespace Marinete.Web.Modules
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

                var query = new AppErrorsQuery(_documentSession)
                {
                    AppName = appName,
                    Page = page,
                    Size = size,
                    Term = term
                };

                var data = query.Execute();

                return Response.AsJson(data);
            };

            Get["/error/{slug}"] = _ =>
                {
                    var slug = (string) _.slug;

                    var error = _documentSession
                        .Query<ErrorsGroupBySlugAndUser.ErrorGroupedBySlugAndUser, ErrorsGroupBySlugAndUser>()
                        .Search(c => c.Slug, slug)
                        .Take(1)
                        .Single();

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
                            error.CurrentUser,
                            error.Solved
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

            Put["/error/{slug}"] = _ =>
                {
                    var slug = (string)_.slug;

                    var error = _documentSession
                        .Query<ErrorsGroupBySlugAndUser.ErrorGroupedBySlugAndUser, ErrorsGroupBySlugAndUser>()
                        .Search(c => c.Slug, slug)
                        .Take(1)
                        .Single();

                    if (null == error) return HttpStatusCode.NotFound;

                    var solved = (!error.Solved).ToString().ToLower();

                    _documentSession.Advanced.DocumentStore.DatabaseCommands.UpdateByIndex(
                        "ErrorsBySlug",
                        new IndexQuery { Query = string.Format("Slug:{0}", error.Slug) },
                        new ScriptedPatchRequest 
                        {
                            Script = string.Format(@"this.Solved = {0};", solved)
                        }
                    );  

                    return HttpStatusCode.OK;
                };
        }

        private MarinetUser GetUser() {
            var user = _documentSession.Query<MarinetUser>()
                                       .FirstOrDefault(c => c.UserName == Context.CurrentUser.UserName);

            return user;
        }
    }

    public static class NancyModuleSecurityExtensions
    {
        public static Response LoginForAjax(this INancyModule module, MarinetUser user,
            DateTime? cookieExpiry = null) 
        {
            var result = module.LoginWithoutRedirect(user.Id, cookieExpiry);
            
            var response = new JsonResponse(new {user.UserName, Role=2}, new DefaultJsonSerializer());
            response.WithCookie(result.Cookies.First());
            return response;
        }
    }
}