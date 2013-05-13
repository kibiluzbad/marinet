using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using Marinete.Common.Indexes;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.Conventions;
using Nancy.Security;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;

namespace Marinete.Web
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        private static volatile IDocumentStore _store;
        private static object _syncRoot = new Object();

        protected override void RequestStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines, NancyContext context)
        {
            base.RequestStartup(container, pipelines, context);

            var formsAuthConfiguration =
                new FormsAuthenticationConfiguration()
                {
                    RedirectUrl = "/new",
                    UserMapper = container.Resolve<IUserMapper>(),
                };

            FormsAuthentication.Enable(pipelines, formsAuthConfiguration);
        }

        
        protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
        {
            container.Register<IDocumentStore>(GetStore());

            container.Register<IUserMapper, MarinetUserMapper>();
            container.Register((a, b) => container.Resolve<IDocumentStore>().OpenSession());
        }

        private IDocumentStore GetStore()
        {
            var config = ConfigurationManager.ConnectionStrings["ravenConn"];

            if (null != _store) return _store;

            lock (_syncRoot)
            {
                _store = new EmbeddableDocumentStore
                    {
                        DataDirectory = config.ConnectionString
                    };

                _store.Initialize();

                IndexCreation.CreateIndexes(typeof(UniqueVisitorsIndex).Assembly, _store);
            }

            return _store;
        }
      
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            base.ConfigureConventions(conventions);

            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("app", @"app")
            );
        }
    }

    public class MarinetUserMapper : IUserMapper
    {
        public IUserIdentity GetUserFromIdentifier(Guid identifier, NancyContext context)
        {
            return new Guid("757538E3-A798-4DCF-8620-D349B4BEECFA") == identifier
                ? new MarinetUser("admin")
                : null;
        }
    }

    public class MarinetUser : IUserIdentity
    {
        public string UserName { get; set; }
        public IEnumerable<string> Claims { get; set; }

        public MarinetUser(string userName)
        {
            UserName = userName;
        }
    }
}