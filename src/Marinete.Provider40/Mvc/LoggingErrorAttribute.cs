using System.Web;
using System.Web.Mvc;
using Marinete.Common.Domain;

namespace Marinete.Provider40.Mvc {

    public class LoggingErrorAttribute : HandleErrorAttribute {

        public override void OnException(ExceptionContext context) {
            var exception = context.Exception.InnerException ?? context.Exception;
            var currentUser = HttpContext.Current.User.Identity.Name;

            var error = new Error {
                CurrentUser = !string.IsNullOrWhiteSpace(currentUser) ? HttpContext.Current.User.Identity.Name : "marinet",
                Exception = exception.ToString(),
                Message = exception.Message
            };

            var provider = new MarineteRestfulProvider();
            provider.Error(error);
        }
    }
}
