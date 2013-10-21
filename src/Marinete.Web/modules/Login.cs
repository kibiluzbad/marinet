using System.Linq;
using Marinete.Web.models;
using Marinete.Web.Security;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.modules
{
    public class Login : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Login(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            Get["/logout"] = parameters => this.LogoutAndRedirect("/");

            Get["/login"] = parameters => View[new LoginModel()];

            Post["/login"] = parameters =>
                {
                    var viewModel = this.Bind<LoginModel>();

                    var user = _documentSession.Query<MarinetUser>()
                                               .FirstOrDefault(c => c.UserName == viewModel.Username 
                                                                 && c.Password == viewModel.Password);
                    return null != user
                               ? this.Login(user.Id)
                               : HttpStatusCode.Unauthorized;
                };
        }
    }
}