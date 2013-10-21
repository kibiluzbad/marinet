﻿using Nancy;
using Nancy.Security;

namespace Marinete.Web.modules
{
    public class Main : NancyModule
    {
        public Main()
        {
            this.RequiresAuthentication();
            
            Get["/"] = _ => View["index"];

            Get["/apps"] = _ => View["index"];

            Get["/{appName}/errors"] = _ => View["index"];

            Get["/{appName}/errors/{id}"] = _ => View["index"];
            
        }
    }
}