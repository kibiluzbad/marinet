using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using Autofac.Integration.WebApi;
using Raven.Client;

namespace Marinete.Web.Api.Filters
{
    public class RavendbActionFilter : IAutofacActionFilter
    {
        private readonly IDocumentSession _session;

        public RavendbActionFilter(IDocumentSession session)
        {
            _session = session;
        }


        public void OnActionExecuting(HttpActionContext actionContext)
        {
           
        }

        public void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
           if (null == actionExecutedContext.Exception)
                _session.SaveChanges();
        }
    }
}