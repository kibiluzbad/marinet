using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Models;
using Marinete.Web.Queries;
using Marinete.Web.Security;
using Nancy;
using Nancy.ModelBinding;
using Nancy.Security;
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
}