using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Nancy;
using Nancy.Security;
using Raven.Client;

namespace Marinete.Web.modules.Api
{
    public class Accounts : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Accounts(IDocumentSession documentSession):base("/api/account")
        {
            _documentSession = documentSession;

            After += ctx => _documentSession.SaveChanges();

            Get["/token"] = _ =>
            {
                string appName = "" + Request.Query["appName"];
                string appKey = "" + Request.Query["appKey"];

                var account = documentSession.Query<Account>()
                                             .FirstOrDefault(
                                                 c => c.Apps.Any(d => d.Name == appName && d.Key == appKey));

                if (null == account)
                    return HttpStatusCode.NotFound;

                var token = new Token
                {
                    Value = (ShortGuid)Guid.NewGuid(),
                    ValidTo = DateTime.Now.AddMinutes(5),
                    App = account.Apps.FirstOrDefault(c => c.Name == appName)
                };

                documentSession.Store(token, token.Value);

                return token.Value;
            };
        }
    }
}