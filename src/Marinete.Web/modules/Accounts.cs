using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Nancy;
using Raven.Client;

namespace Marinete.Web.modules
{
    public class Accounts : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Accounts(IDocumentSession documentSession)
        {
            _documentSession = documentSession;



            Get["/"] = _ => Response.AsRedirect("/app/index.html");

            Get["/account/apps"] = _ =>
                {
                    var account = _documentSession.Query<Account>()
                                                  .FirstOrDefault();

                    if (null == account)
                        return HttpStatusCode.NotFound;

                    return Response.AsJson(account.Apps);
                };

            Get["/login"] = _ => Response.AsRedirect("/app/login.html");
                
        }
    }
}