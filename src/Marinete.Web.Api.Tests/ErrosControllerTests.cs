using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using Lucene.Net.Documents;
using Marinete.Common.Domain;
using Marinete.Common.Indexes;
using Marinete.Common.Infra;
using Marinete.Web.modules;
using NUnit.Framework;
using Nancy;
using Nancy.Testing;
using Raven.Imports.Newtonsoft.Json;


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
                    App = new Application
                        {
                            Key = (ShortGuid) Guid.NewGuid(), 
                            Name = "MarineteWeb"
                        }
                };

                session.Store(_token,_token.Value);
                session.Store(new Error { AppName = "MarineteWeb", CreatedAt = DateTime.Now});
                session.Store(new Error { AppName = "MarineteWeb", CreatedAt = DateTime.Now });
                session.Store(new Error { AppName = "OtherApp", CreatedAt = DateTime.Now });
                session.SaveChanges();
            }
        }
        
        [Test]        
        public void Call_to_index_should_return_all_errors_of_app()
        {
            var browser = new Browser(Bootstrapper);

            var response = browser.Get("/errors/MarineteWeb", (with) =>
            {
                with.HttpRequest();
            });

            Assert.That(response.StatusCode, 
                Is.EqualTo(HttpStatusCode.OK));
        }
    }
}
