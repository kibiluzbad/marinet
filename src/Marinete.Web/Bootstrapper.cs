using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Web;
using Autofac;
using Marinete.Common.Indexes;
using Marinete.Providers.Domain;
using NLog;
using Nancy;
using Nancy.Conventions;
using Nancy.ErrorHandling;
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
                    DataDirectory = @"C:\work\levelupgames.marinete\src\Marinete.Web\Data"
                    
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

//#pragma warning disable 612,618
//    public class LoggingErrorHandler : IErrorHandler
//#pragma warning restore 612,618
//    {
//        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

//        public bool HandlesStatusCode(HttpStatusCode statusCode, NancyContext context)
//        {
//            return statusCode == HttpStatusCode.InternalServerError;
//        }

//        public void Handle(HttpStatusCode statusCode, NancyContext context)
//        {
//            object errorObject;
//            context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out errorObject);
//            var error = errorObject as Exception;

//            var config = new Marinete.Providers.MarineteConfig
//                {
//                    AppKey = "",
//                    AppName = "MarineteWeb",
//                    RootUrl = "http://localhost:6262/"
//                };

//            var provider = new Marinete.Providers.MarineteRestfulProvider(config: config);
//            provider.Error(new Error { });

//            _logger.Fatal(error.Message, error);
//        }
//    }
}