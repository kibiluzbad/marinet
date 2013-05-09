using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.ModelBinding;
using Nancy.Security;

namespace Marinete.Web.modules
{
    public class LoginModule : NancyModule
    {
        public LoginModule()
        {
            Get["/login"] = parameters => View[new LoginModel()];

            Get["/logout"] = parameters =>
            {
                // Called when the user clicks the sign out button in the application. Should
                // perform one of the Logout actions (see below)
                throw new NotImplementedException();
            };

            Post["/login"] = parameters =>
                {
                    var viewModel = this.Bind<LoginModel>();
                    
                    if ("admin" == viewModel.Username &&
                        "password" == viewModel.Password)
                    {
                        return this.LoginAndRedirect(new Guid());
                    }

                    return HttpStatusCode.Unauthorized;
                };
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}