using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using Autofac;
using Marinete.Common.Indexes;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.Conventions;
using Nancy.Security;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;
using Nancy.Bootstrappers.Autofac;

namespace Marinete.Web
{
    public class Bootstrapper : AutofacNancyBootstrapper
    {
        protected override void RequestStartup(ILifetimeScope container, Nancy.Bootstrapper.IPipelines pipelines, NancyContext context)
        {
            base.RequestStartup(container, pipelines, context);

            var formsAuthConfiguration =
                new FormsAuthenticationConfiguration()
                {
                    RedirectUrl = "~/login",
                    UserMapper = container.Resolve<IUserMapper>(),
                };

            FormsAuthentication.Enable(pipelines, formsAuthConfiguration);
        }

        protected override void ConfigureApplicationContainer(Autofac.ILifetimeScope existingContainer)
        {
            var builder = new ContainerBuilder();

            builder.Register(c =>
            {
                var store = new EmbeddableDocumentStore
                {
                    DataDirectory = @"C:\work\levelupgames.marinete\src\Marinete.Web\Data"
                    
                }.Initialize();

                IndexCreation.CreateIndexes(typeof(UniqueVisitorsIndex).Assembly, store);

                return store;
            })
                   .As<IDocumentStore>().SingleInstance();

            builder.Register(c => c.Resolve<IDocumentStore>().OpenSession())
                   .As<IDocumentSession>().InstancePerLifetimeScope();

            builder.RegisterType<MarinetUserMapper>().As<IUserMapper>();

            builder.RegisterAssemblyModules(Assembly.GetExecutingAssembly());

            builder.Update(existingContainer.ComponentRegistry);
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
            return new MarinetUser("admin");
        }
    }

    public class MarinetUser : IUserIdentity
    {
        public string UserName { get; private set; }
        public IEnumerable<string> Claims { get; private set; }

        public MarinetUser(string userName)
        {
            UserName = userName;
        }
    }
}