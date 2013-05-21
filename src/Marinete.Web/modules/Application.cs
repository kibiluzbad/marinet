using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Marinete.Common.Domain;
using Marinete.Web.Security;
using Nancy;
using Raven.Client;

namespace Marinete.Web.modules
{
    public class Application : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Application(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            After += _ => _documentSession.SaveChanges();

            Get["/setup"] = _ =>
                {
                    var adminAccount = _documentSession.Query<Account>().FirstOrDefault();
                    var adminUser = _documentSession.Query<MarinetUser>().FirstOrDefault();

                    if (null == adminUser)
                    {
                        adminUser = new MarinetUser("admin"){Password = "password"};
                        _documentSession.Store(adminUser);
                    }

                    if (null == adminAccount)
                    {
                        adminAccount = new Account();
                        adminAccount.CreateApp("MarinetWeb", "_HW6kuKEXEaBTj0JuBCJHw");
                        _documentSession.Store(adminAccount);
                    }

                    if (0 == adminAccount.Users.Count) adminAccount.AddUser(adminUser.Id);

                    return Response.AsRedirect("/new");
                };
        }

    }
}