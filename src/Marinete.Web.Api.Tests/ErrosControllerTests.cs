using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Marinete.Web.Api.Controllers;
using NUnit.Framework;


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
            var controller = new ErrorsController(Session);

            var errors = controller.Index(_token.Value);

            Assert.That(errors.Count, 
                Is.GreaterThan(0));
        }

        [Test]
        public void Call_to_index_with_invalid_token_should_throw_401()
        {
            var controller = new ErrorsController(Session);

            Assert.That(() => controller.Index("invalidtoken"),
                Throws.Exception.InstanceOf<HttpResponseException>());
        }

        [Test]
        public void Call_to_index_with_expired_token_should_throw_401()
        {
            _token.ValidTo = DateTime.Now.AddMinutes(-6);
            Session.Store(_token,_token.Value);
            Session.SaveChanges();

            var controller = new ErrorsController(Session);

            Assert.That(() => controller.Index(_token.Value),
                Throws.Exception.InstanceOf<HttpResponseException>());
        }

        [Test]
        public void Call_to_add_should_save_new_error()
        {
            var controller = new ErrorsController(Session);

            var newError = new Error
                {
                    AppName = "MarineteWeb",
                    CreatedAt = DateTime.Now,
                    CurrentUser = "lub-brz\\lcardoso",
                    Exception = null,
                    Message = "Exception message",
                    OsVersion = "Windows 7",
                    Platform = "64",
                    Processors = 8,
                    ServicePack = "SP1"
                };

            controller.Add( newError);

            Session.SaveChanges();

            var savedError =  Session.Query<Error>()
                .ToList()
                .Last();

            Assert.That(savedError.Message,
                Is.EqualTo(newError.Message));

        }
    }
}
