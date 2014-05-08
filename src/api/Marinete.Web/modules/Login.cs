using System.Linq;
using Marinete.Web.Models;
using Marinete.Web.Security;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.Modules
{
    public class Login : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Login(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            Delete["/logout"] = parameters => this.LogoutWithoutRedirect();

            Post["/login"] = parameters =>
                {
                    var viewModel = this.Bind<LoginModel>();

                    var user = _documentSession.Query<MarinetUser>()
                                               .FirstOrDefault(c => c.UserName == viewModel.Username 
                                                                 && c.Password == viewModel.Password);
                    if (null == user) return HttpStatusCode.Unauthorized;

                    return this.LoginForAjax(user);
                };
        }
    }
}