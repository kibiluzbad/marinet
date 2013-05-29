using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Infra;

namespace Marinete.Common.Domain
{
    public class Account
    {
        public ICollection<Application> Apps { get; set; }
        public ICollection<Guid> Users { get; set; }

        public Account()
        {
            Apps = new HashSet<Application>();
            Users = new HashSet<Guid>();
        }



        public virtual Application CreateApp(string appName, string key = null)
        {
            ShortGuid shortGuid = Guid.NewGuid();

            if (null != key)
                shortGuid = new ShortGuid(key);

            var app = new Application
                {
                    Name = appName,
                    Key = shortGuid
                };

            Apps.Add(app);

            return app;
        }

        public virtual Guid AddUser(Guid userId)
        {
            Users.Add(userId);
            return userId;
        }
    }
}