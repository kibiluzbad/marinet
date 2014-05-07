using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Models;
using Marinete.Web.Security;
using Nancy;
using Nancy.ModelBinding;
using Nancy.Security;
using Raven.Abstractions.Data;
using Raven.Client;

namespace Marinete.Web.Modules
{
    public class Accounts : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Accounts(IDocumentSession documentSession)
        {
            this.RequiresAuthentication();
            
            _documentSession = documentSession;

            After += ctx => _documentSession.SaveChanges();

            Get["/account/apps"] = _ =>
                {
                    var account = GetAccount();

                    if (null == account) return HttpStatusCode.NotFound;

                    return Response.AsJson(account.Apps);
                };

            Post["/account/app"] = _ =>
                {
                    var account = GetAccount();

                    if (null == account) return HttpStatusCode.NotFound;

                    var app = this.Bind<AppCreateModel>();

                    account.CreateApp(app.Name);

                    return account.Apps.Last();
                };

            Post["/account/{appName}/purge"] = _ =>
                {
                    string appName = _.appName;

                    var indexQuery = new IndexQuery
                    {
                        Query = string.Format("AppName:{0}", appName), 
                        Cutoff = DateTime.Now.AddMinutes(1)
                    };

                    _documentSession.Advanced
                                    .DocumentStore
                                    .DatabaseCommands
                                    .DeleteByIndex("ErrorsByIdAndAppName", indexQuery, false);

                    return HttpStatusCode.OK;
                };
        }

        private Account GetAccount()
        {
            var user = _documentSession.Query<MarinetUser>()
                                       .FirstOrDefault(c => c.UserName == "admin");


            var account = _documentSession.Query<Account>()
                                          .FirstOrDefault(c => c.Users.Any(d => d == user.Id));
            return account;
        }
    }
}