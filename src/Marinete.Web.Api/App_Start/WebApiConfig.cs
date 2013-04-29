using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Routing;

namespace Marinete.Web.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                "GetToken",
                "api/account/token",
                new {controller = "account", action = "getToken"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Get)}
                );

            config.Routes.MapHttpRoute(
                "AddApp",
                "api/account/app",
                new {controller = "account", action = "addApp"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Post)}
                );

            config.Routes.MapHttpRoute(
                "GetApp",
                "api/account/apps",
                new {controller = "account", action = "getApps"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Get)}
                );

            config.Routes.MapHttpRoute(
                "GetErrors",
                "api/errors",
                new {controller = "errors", action = "index"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Get)}
                );

            config.Routes.MapHttpRoute(
                "AddError",
                "api/error",
                new {controller = "errors", action = "add"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Post)}
                );
            config.Routes.MapHttpRoute(
                "GetSameErrors",
                "api/error",
                new {controller = "errors", action = "getSameErrors"},
                new {httpMethod = new HttpMethodConstraint(HttpMethod.Get)}
                );
        }
    }
}
