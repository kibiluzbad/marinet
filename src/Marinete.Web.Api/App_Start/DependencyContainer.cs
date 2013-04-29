using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using Marinete.Web.Api.Controllers;
using Marinete.Web.Api.Filters;
using Raven.Client;
using Raven.Client.Embedded;
using Marinete.Common.Domain;
using Raven.Client.Indexes;

namespace Marinete.Web.Api.App_Start
{
    public static class DependencyContainer
    {
        public static void Create()
        {
            var builder = new ContainerBuilder();

            builder.RegisterApiControllers(typeof (WebApiApplication).Assembly);

            builder.Register(c =>
                {
                    var store = new EmbeddableDocumentStore
                        {
                            DataDirectory = "Data"
                        }.Initialize();

                    IndexCreation.CreateIndexes(typeof(DependencyContainer).Assembly, store);

                    return store;
                })
                   .As<IDocumentStore>()
                   .SingleInstance();

            builder.Register(c => c.Resolve<IDocumentStore>().OpenSession())
                   .As<IDocumentSession>()
                   .InstancePerApiRequest();

            builder.Register(c => new RavendbActionFilter(c.Resolve<IDocumentSession>()))
                   .AsWebApiActionFilterFor<ErrorsController>(c => c.Index(default(string)))
                   .InstancePerApiRequest();

            builder.Register(c => new RavendbActionFilter(c.Resolve<IDocumentSession>()))
                   .AsWebApiActionFilterFor<ErrorsController>(c => c.Add( default(Error)))
                   .InstancePerApiRequest();

            builder.Register(c => new RavendbActionFilter(c.Resolve<IDocumentSession>()))
                   .AsWebApiActionFilterFor<AccountController>(c => c.GetToken(default(string), default(string)))
                   .InstancePerApiRequest();

            builder.Register(c => new RavendbActionFilter(c.Resolve<IDocumentSession>()))
                   .AsWebApiActionFilterFor<AccountController>(c => c.AddApp(default(string)))
                   .InstancePerApiRequest();

            builder.RegisterWebApiFilterProvider(GlobalConfiguration.Configuration);

            var container = builder.Build();

            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}