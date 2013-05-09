using System;
using System.Web;
using Marinete.Common.Config;
using Marinete.Providers.Domain;
using NLog;
using Nancy;
using Nancy.ErrorHandling;

namespace Marinete.Web
{
    public class LoggingErrorHandler : IErrorHandler
    {
        private readonly Logger _logger = LogManager.GetCurrentClassLogger();

        public bool HandlesStatusCode(HttpStatusCode statusCode, NancyContext context)
        {
            return statusCode == HttpStatusCode.InternalServerError;
        }

        public void Handle(HttpStatusCode statusCode, NancyContext context)
        {
            object errorObject;
            context.Items.TryGetValue(NancyEngine.ERROR_EXCEPTION, out errorObject);
            var error = (errorObject as Exception).InnerException;

            var marinetConfig = MarinetConfigurationHelper.Get();

            var config = new Marinete.Providers.MarineteConfig
                {
                    AppKey = marinetConfig.AppKey,
                    AppName = marinetConfig.AppName,
                    RootUrl = marinetConfig.RootUrl
                };

            var provider = new Marinete.Providers.MarineteRestfulProvider(config: config);
            provider.Error(new Error { CurrentUser = HttpContext.Current.User.Identity.Name, Exception = error.ToString(), Message = error.Message});

            _logger.Fatal(error.Message, error);
        }
    }
}