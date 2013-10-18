using System;
using System.Configuration;
using System.Linq;
using System.Reflection;
using Marinete.Web.Indexes;
using Marinete.Web.Security;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.Conventions;
using Nancy.Json;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Embedded;
using Raven.Client.Indexes;

namespace Marinete.Web
{
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        private static volatile IDocumentStore _store;
        private static readonly object SyncRoot = new Object();

        protected override void RequestStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines, NancyContext context)
        {
            JsonSettings.MaxJsonLength = Int32.MaxValue;

            base.RequestStartup(container, pipelines, context);

            var formsAuthConfiguration =
                new FormsAuthenticationConfiguration()
                {
                    RedirectUrl = "/login",
                    DisableRedirect = true,
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
            if (null != _store) return _store;

            lock (SyncRoot)
            {
#if DEBUG
                _store = new EmbeddableDocumentStore
                {
                    ConnectionStringName = "ravenConnLocal",
                    UseEmbeddedHttpServer = true,
                };
                ((EmbeddableDocumentStore)_store).Configuration.Port = 6263;
#else
                _store = new DocumentStore { ConnectionStringName = "ravenConn" };
#endif

                _store.Initialize();

                IndexCreation.CreateIndexes(typeof(UniqueMessageIndex).Assembly, _store);
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
}