using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Marinete.Common.Infra;
using Moq;
using NUnit.Framework;
using RestSharp;

namespace Marinete.Providers.Tests
{
    [TestFixture]
    public class TokenAuthProviderTests
    {
        [Test]
        public void Should_get_token_from_marinete_web_api()
        {
            var fakeClient = new Mock<IRestClient>();

            var fakeResponse = new Mock<IRestResponse>();

            var config = new MarineteConfig
                {
                    RootUrl = "http://mari.net",
                    AppName = "MarineteWeb",
                    AppKey = (ShortGuid) Guid.NewGuid()
                };

            string desiredToken = (ShortGuid) Guid.NewGuid();

            fakeClient.Setup(c => c.Execute(It.IsAny<IRestRequest>())).Returns(fakeResponse.Object);
            fakeResponse.Setup(c => c.StatusCode).Returns(HttpStatusCode.OK);
            fakeResponse.Setup(c => c.Content).Returns(desiredToken);

            ITokenAuthProvider provider = new TokenAuthProvider(fakeClient.Object, config);
            var token = provider.GetToken();

            Assert.That(token, Is.EqualTo(desiredToken));
        }
    }
}
