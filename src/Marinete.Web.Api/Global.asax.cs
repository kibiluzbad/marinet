using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Mvc;
using System.Web.Routing;
using Marinete.Web.Api.App_Start;
using WebApiContrib.Formatting.Jsonp;

namespace Marinete.Web.Api
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            DependencyContainer.Create();

            GlobalConfiguration.Configuration.Formatters.Clear();
            GlobalConfiguration.Configuration.Formatters.Add(new JsonpMediaTypeFormatter());
            GlobalConfiguration.Configuration.Formatters.Add(new FormUrlEncodedMediaTypeFormatter());
            GlobalConfiguration.Configuration.Formatters.Add(new JQueryMvcFormUrlEncodedFormatter());

        }
    }
}