using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using Autofac;
using Marinete.Common.Indexes;
using Nancy;
using Nancy.Conventions;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Indexes;
using Nancy.Bootstrappers.Autofac;

namespace Marinete.Web
{
    public class Bootstrapper : AutofacNancyBootstrapper
    {
        protected override void ConfigureApplicationContainer(Autofac.ILifetimeScope existingContainer)
        {
            var builder = new ContainerBuilder();

            builder.Register(c =>
            {
                var store = new EmbeddableDocumentStore
                {
                    DataDirectory = @"C:\work\levelupgames.marinete\src\Marinete.Web.Api\Data",
                    
                }.Initialize();

                IndexCreation.CreateIndexes(typeof(UniqueVisitorsIndex).Assembly, store);

                return store;
            })
                   .As<IDocumentStore>().SingleInstance();

            builder.Register(c => c.Resolve<IDocumentStore>().OpenSession())
                   .As<IDocumentSession>().InstancePerLifetimeScope();

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
}