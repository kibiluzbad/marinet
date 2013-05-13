using System;
using System.Web;
using Marinete.Common.Config;
//using Marinete.Providers.Domain;
using Marinete.Common.Domain;
using Marinete.Provider40;
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

            if (null == errorObject) return;
            
            var error = (errorObject as Exception).InnerException;

            var provider = new MarineteRestfulProvider();
            provider.Error(new Error { CurrentUser = HttpContext.Current.User.Identity.Name, Exception = error.ToString(), Message = error.Message });

            _logger.Fatal(error.Message, error);
        }
    }
}