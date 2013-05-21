using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Marinete.Web.Security;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;
using Nancy.Security;
using Raven.Database.Smuggler;

namespace Marinete.Web.modules
{
    public class Accounts : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Accounts(IDocumentSession documentSession)
        {
            this.RequiresAuthentication();

            _documentSession = documentSession;

            After += ctx => _documentSession.SaveChanges();


            Get["/"] = _ => Response.AsRedirect("/app/index.html");

            Get["/account/apps"] = _ =>
                {
                    var user = _documentSession.Query<MarinetUser>()
                                               .FirstOrDefault(c => c.UserName == Context.CurrentUser.UserName);
                    if (null == user) return HttpStatusCode.NotFound;

                    var account = _documentSession.Query<Account>()
                                                  .FirstOrDefault(c => c.Users.Any(d => d == user.Id));

                    if (null == account) return HttpStatusCode.NotFound;

                    return Response.AsJson(account.Apps);
                };

            Post["/account/app"] = _ => 
            {
                var account = _documentSession.Query<Account>()
                                              .FirstOrDefault();

                if (null == account)
                {
                    return HttpStatusCode.NotFound;
                }

                var app = this.Bind<Common.Domain.Application>();

                account.CreateApp(app.Name);

                return HttpStatusCode.OK;
            };

            Get["/login"] = _ => Response.AsRedirect("/app/login.html");
                
        }
    }
}