using NUnit.Framework;
using Raven.Client;
using Raven.Client.Embedded;
using Raven.Client.Listeners;

namespace Marinete.Web.Api.Tests
{
    public abstract class RavenDbBaseTest
    {
        protected EmbeddableDocumentStore Store;
        protected IDocumentSession Session;

        [TestFixtureSetUp]
        public void TestFixtureSetUp()
        {
            Store = new EmbeddableDocumentStore
                {
                    RunInMemory = true
                };

            Store.Initialize();
            Store.RegisterListener(new NoStaleQueriesListener());

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
}