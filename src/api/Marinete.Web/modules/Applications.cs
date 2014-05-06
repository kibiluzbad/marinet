using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Security;
using Nancy;
using Raven.Abstractions.Data;
using Raven.Client;

namespace Marinete.Web.Modules
{
    public class Applications : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Applications(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            After += _ => _documentSession.SaveChanges();

            Get["/setup"] = _ =>
                {
                    var adminAccount = _documentSession.Query<Account>().FirstOrDefault();
                    var adminUser = _documentSession.Query<MarinetUser>().FirstOrDefault();

                    if (null == adminUser)
                    {
                        adminUser = new MarinetUser("admin"){ Password = "password" };
                        _documentSession.Store(adminUser);
                    }

                    if (null == adminAccount)
                    {
                        adminAccount = new Account();
                        adminAccount.CreateApp("MarinetWeb", "ask0DsWqyU6wb5-ggvyZvA");
                        _documentSession.Store(adminAccount);
                    }

                    if (0 == adminAccount.Users.Count) adminAccount.AddUser(adminUser.Id);

                    return Response.AsRedirect("/login");
                };

            Get["/slugs"] = _ =>
            {
                _documentSession.Advanced.DocumentStore.DatabaseCommands.UpdateByIndex(
                    "Raven/DocumentsByEntityName",
                    new IndexQuery {Query = "Tag:Errors"},
                    new ScriptedPatchRequest()
                    {
                        Script = @"
                        this.Slug = this.Message.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');"
                    }
                    );
                return "Slugified";
            };

            Get["/slugs-reduce"] = _ =>
            {
                _documentSession.Advanced.DocumentStore.DatabaseCommands.UpdateByIndex(
                    "Raven/DocumentsByEntityName",
                    new IndexQuery { Query = "Tag:Errors" },
                    new ScriptedPatchRequest()
                    {
                        Script = @"
                        this.Slug = this.Slug.substring(0, this.Slug.length <= 45 ? this.Slug.length : 45);"
                    }
                    );
                return "Reduced";
            };

            Get["/unsolve-all"] = _ =>
            {
                _documentSession.Advanced.DocumentStore.DatabaseCommands.UpdateByIndex(
                    "Raven/DocumentsByEntityName",
                    new IndexQuery { Query = "Tag:Errors" },
                    new ScriptedPatchRequest()
                    {
                        Script = @"
                        this.Solved = false;"
                    }
                    );
                return "Unsolved all";
            };
        }
    }
}