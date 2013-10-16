using System;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using NUnit.Framework;
using Nancy;
using Nancy.Testing;

namespace Marinete.Web.Api.Tests
{
    [TestFixture]
    public class ErrosControllerTests : RavenDbBaseTest
    {
        private Token _token;

        protected override void  FixtureSetUp()
        {
            using (var session = Store.OpenSession())
            {
                _token = new Token
                {
                    Value = (ShortGuid)Guid.NewGuid(),
                    ValidTo = DateTime.Now.AddMinutes(5),
                    App = new Application ("MarineteWeb", (ShortGuid) Guid.NewGuid())
                };

                session.Store(_token,_token.Value);
                session.Store(new Error { AppName = "MarineteWeb" });
                session.Store(new Error { AppName = "MarineteWeb" });
                session.Store(new Error { AppName = "OtherApp" });
                session.SaveChanges();
            }
        }
        
        [Test, Ignore]        
        public void Call_to_index_should_return_all_errors_of_app()
        {
            var browser = new Browser(Bootstrapper);

            var response = browser.Get("/errors/MarineteWeb", with => with.HttpRequest());

            Assert.That(response.StatusCode, 
                Is.EqualTo(HttpStatusCode.OK));
        }
    }
}
