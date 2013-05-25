using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Marinete.Common.Domain;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.modules.Api
{
    public class Errors : NancyModule
    {
        private readonly IDocumentSession _documentSession;

        public Errors(IDocumentSession documentSession)
            : base("/api/error")
        {
            _documentSession = documentSession;

            After += ctx => _documentSession.SaveChanges();

            Post["/"] = _ =>
                {
                    var error = this.Bind<Error>();

                    if(null == error)
                        return HttpStatusCode.BadRequest;

                    string tokenKey = "" + Request.Headers.FirstOrDefault(c => c.Key == "tokenKey").Value.FirstOrDefault();
                    error.CreatedAt = DateTime.Now;

                    var token = _documentSession.Load<Token>(tokenKey);

                    if (null == token || token.Expired)
                        return HttpStatusCode.Unauthorized;

                    error.AppName = token.App.Name;

                    _documentSession.Store(error);

                    return HttpStatusCode.OK;
                };
        }
    }
}