using System.Reflection;
using Autofac;
using Marinete.Web.Indexes;
using NUnit.Framework;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Embedded;
using Raven.Client.Indexes;
using Raven.Client.Listeners;

namespace Marinete.Web.Api.Tests
{
    public abstract class RavenDbBaseTest
    {
        protected EmbeddableDocumentStore Store;
        protected IDocumentSession Session;
        protected Bootstrapper Bootstrapper;

        [TestFixtureSetUp]
        public void TestFixtureSetUp()
        {
            Store = new EmbeddableDocumentStore
            {
                RunInMemory = true
            };

            Store.Initialize();
            IndexCreation.CreateIndexes(typeof(UniqueMessageIndex).Assembly, Store);
            Store.RegisterListener(new NoStaleQueriesListener());

            Bootstrapper = new FakeBoostrapper(Store);

            FixtureSetUp();
        }

        protected virtual void FixtureSetUp()
        {
            
        }

        [SetUp]
        public void Setup()
        {
            Session = Store.OpenSession();
            TestSetup();
        }

        protected virtual void TestSetup()
        {
            
        }

        [TearDown]
        public void TearDown()
        {
            TestTearDown();
            Session.SaveChanges();
            Session.Dispose();
        }

        protected virtual void TestTearDown()
        {

        }

        [TestFixtureTearDown]
        public void TestFixtureTearDown()
        {
            Store.Dispose();
        }
    }

    public class NoStaleQueriesListener : IDocumentQueryListener
    {
        #region Implementation of IDocumentQueryListener

        public void BeforeQueryExecuted(IDocumentQueryCustomization queryCustomization)
        {
            queryCustomization.WaitForNonStaleResults();
        }

        #endregion
    }

    public class FakeBoostrapper : Marinete.Web.Bootstrapper
    {
        private readonly DocumentStore _store;

        public FakeBoostrapper(DocumentStore store)
        {
            _store = store;
        }

        protected override void ConfigureApplicationContainer(Nancy.TinyIoc.TinyIoCContainer container)
        {
            base.ConfigureApplicationContainer(container);

            container.Register<IDocumentStore>((a, b) => _store);
            container.Register((a,b) => container.Resolve<IDocumentStore>().OpenSession());
        }
    }
}