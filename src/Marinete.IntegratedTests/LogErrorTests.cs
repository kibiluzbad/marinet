using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Marinete.Providers;
using Marinete.Providers.Domain;
using NUnit.Framework;
using RestSharp;

namespace Marinete.IntegratedTests
{
    [TestFixture]
    public class LogErrorTests
    {
        [Test]
        public void Should_log_error()
        {
            var config = new MarineteConfig { AppKey = "wdQ4jOk2DkCmJMOqW61t0g", AppName = "MarineteWeb", RootUrl = "http://localhost:6262/" };
            IMarineteProvider marineteProvider = new MarineteRestfulProvider(new RestClient(),
                                                                             new TokenAuthProvider(new RestClient(),
                                                                                                   config),
                                                                             config);

            HttpStatusCode result = marineteProvider.Error(new Error
                {
                    AppName = config.AppName,
                    CreatedAt = DateTime.Now,
                    CurrentUser = "lcardoso",
                    Exception = new ApplicationException("Operação invalida", new TimeoutException()).ToString(),
                    Message = "Erro!",
                    OsVersion = "Windows 7 Professional",
                    Platform = "64",
                    Processors = 8,
                    ServicePack = "SP1"
                });

            Assert.That(result, 
                Is.EqualTo(HttpStatusCode.OK));
        }
    }
}
