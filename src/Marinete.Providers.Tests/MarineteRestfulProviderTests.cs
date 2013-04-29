using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Marinete.Common.Domain;
using Moq;
using NUnit.Framework;
using RestSharp;

namespace Marinete.Providers.Tests
{
    [TestFixture]
    public class MarineteRestfulProviderTests
    {
        [Test]
        public void Should_log_errors_to_marinete_web_api()
        {
            var fakeClient = new Mock<IRestClient>();
            var fakeTokenAuthProvider = new Mock<ITokenAuthProvider>();
            var fakeResponse = new Mock<IRestResponse>();

            var config = new MarineteConfig
                {
                    RootUrl = "http://mari.net"
                };

            fakeResponse.Setup(c => c.StatusCode).Returns(HttpStatusCode.OK);

            fakeClient.Setup(c => c.Execute(It.IsAny<IRestRequest>())).Returns(fakeResponse.Object);


            IMarineteProvider provider = new MarineteRestfulProvider(fakeClient.Object,
                fakeTokenAuthProvider.Object, 
                config);

            HttpStatusCode result = provider.Error(new Error());

            Assert.That(result, 
                Is.EqualTo(HttpStatusCode.OK));
        }

        [Test]
        public void Should_execute_RestClient_when_calling_error_method()
        {
            var mockClient = new Mock<IRestClient>();
            var fakeTokenAuthProvider = new Mock<ITokenAuthProvider>();
            var fakeResponse = new Mock<IRestResponse>();

            var config = new MarineteConfig
                {
                    RootUrl = "http://mari.net"
                };

            fakeResponse.Setup(c => c.StatusCode).Returns(HttpStatusCode.OK);

            mockClient.Setup(c => c.Execute(It.IsAny<IRestRequest>())).Returns(fakeResponse.Object);


            IMarineteProvider provider = new MarineteRestfulProvider(mockClient.Object,
                                                       fakeTokenAuthProvider.Object,
                                                       config);

            provider.Error(new Error());

            mockClient.Verify(c => c.Execute(
                It.IsAny<IRestRequest>()),
                              Times.Once());
        }

        [Test]
        public void Should_GetToken_from_ITokenAuthProvider_when_calling_error_method()
        {
            var fakeClient = new Mock<IRestClient>();
            var makeTokenAuthProvider = new Mock<ITokenAuthProvider>();
            var fakeResponse = new Mock<IRestResponse>();

            var config = new MarineteConfig
            {
                RootUrl = "http://mari.net"
            };

            fakeResponse.Setup(c => c.StatusCode).Returns(HttpStatusCode.OK);

            fakeClient.Setup(c => c.Execute(It.IsAny<IRestRequest>())).Returns(fakeResponse.Object);


            IMarineteProvider provider = new MarineteRestfulProvider(fakeClient.Object,
                                                       makeTokenAuthProvider.Object,
                                                       config);

            provider.Error(new Error());

            makeTokenAuthProvider.Verify(c=>c.GetToken(),Times.Once());
        }
    }
}
