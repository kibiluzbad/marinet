using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;
using Nancy.Security;

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
                    var account = _documentSession.Query<Account>()
                                                  .FirstOrDefault();

                    if (null == account)
                    {
                        return HttpStatusCode.NotFound;
                    }

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

                var app = this.Bind<Application>();

                account.CreateApp(app.Name);

                return HttpStatusCode.OK;
            };

            Get["/login"] = _ => Response.AsRedirect("/app/login.html");
                
        }
    }
}