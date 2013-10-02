using System;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Security;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.modules
{
    public class LoginModule : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public LoginModule(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            Get["/new"] = parameters =>
                              {
                                  return View[new LoginModel()];
                              };

            Get["/logout"] = parameters => this.LogoutAndRedirect("/");

            Post["/login"] = parameters =>
                {
                    var viewModel = this.Bind<LoginModel>();

                    var user =
                        _documentSession.Query<MarinetUser>()
                                        .FirstOrDefault(
                                            c => c.UserName == viewModel.Username && c.Password == viewModel.Password);
                    return null != user
                               ? this.LoginAndRedirect(user.Id)
                               : HttpStatusCode.Unauthorized;
                };
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}