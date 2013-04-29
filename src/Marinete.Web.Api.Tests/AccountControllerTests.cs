using System;
using System.Collections.Generic;
using System.Web.Http;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Marinete.Web.Api.Controllers;
using NUnit.Framework;

namespace Marinete.Web.Api.Tests
{
    [TestFixture]
    public class AccountControllerTests : RavenDbBaseTest
    {
        private string _appKey;

        protected override void FixtureSetUp()
        {
            _appKey = ((ShortGuid) Guid.NewGuid());
            using (var session = Store.OpenSession())
            {
                session.Store(new Account
                {
                    Apps = new List<Application>
                    {
                        new Application {Key = _appKey, Name = "MarineteWeb"}
                    }
                });
                session.SaveChanges();
            }
        }
        
        [Test]
        public void Should_return_token_for_app_name_and_api_key()
        {
            const string appName = "MarineteWeb";
            
            var controller = new AccountController(Session);

            string token = controller.GetToken(appName, _appKey);

            Assert.That(token, 
                        Is.Not.Null);
        }

        [Test]
        public void Should_throw_404_for_inalid_app_name()
        {
            const string appName = "InvalidAppName";

            var controller = new AccountController(Session);

            Assert.That(() => controller.GetToken(appName, _appKey),
                        Throws.Exception.InstanceOf<HttpResponseException>());
        }

        [Test]
        public void Should_throw_404_for_inalid_api_key()
        {
            const string appName = "MarineteWeb";

            var controller = new AccountController(Session);

            Assert.That(() => controller.GetToken(appName, "inavlidkey"),
                        Throws.Exception.InstanceOf<HttpResponseException>());


        }
    }
}