using System;
using System.Collections.Generic;
using Marinete.Providers.Infra;

namespace Marinete.Providers.Domain
{
    public class Account
    {
        public ICollection<Application> Apps { get; set; }

        public Account()
        {
            Apps = new HashSet<Application>();
        }

        public virtual Application CreateApp(string appName)
        {
            var app = new Application
                {
                    Name = appName,
                    Key = (ShortGuid) Guid.NewGuid()
                };

            Apps.Add(app);

            return app;
        }
    }
}