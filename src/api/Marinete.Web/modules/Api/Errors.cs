﻿using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Infra;
using Nancy;
using Nancy.ModelBinding;
using Raven.Client;

namespace Marinete.Web.Modules.Api
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

                    var tokenKey = "" + Request.Headers.FirstOrDefault(c => c.Key == "tokenKey").Value.FirstOrDefault();

                    var token = _documentSession.Load<Token>(tokenKey);

                    if (null == token || token.Expired)
                        return HttpStatusCode.Unauthorized;

                    error.AppName = token.App.Name;
                    error.Slug = error.Message.Slugify();

                    _documentSession.Store(error);

                    return HttpStatusCode.OK;
                };
        }
    }
}