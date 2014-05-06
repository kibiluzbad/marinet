using Marinete.Web.Models;
using Marinete.Web.Security;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.Modules
{
    public class Signup : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Signup(IDocumentSession documentSession)
        {
            _documentSession = documentSession;

            After += _ => _documentSession.SaveChanges();

            Get["/signup"] = parameters => View[new SignupModel()];

            Post["/signup"] = parameters => 
                {
                    var viewModel = this.Bind<SignupModel>();

                    if (!viewModel.Password.Equals(viewModel.ConfirmPassword)) 
                        return View[new SignupModel()];

                    if (string.IsNullOrEmpty(viewModel.Username))
                        return View[new SignupModel()];

                    if (string.IsNullOrEmpty(viewModel.Password))
                        return View[new SignupModel()];
            
                    var user = new MarinetUser(viewModel.Username) { Password = viewModel.Password };
                    _documentSession.Store(user);

                    return Response.AsRedirect("/login");
                };
        }
    }
}