using System;
using System.Collections.Generic;
using Marinete.Common.Infra;

namespace Marinete.Common.Domain
{
    public class Account
    {
        public ICollection<Application> Apps { get; private set; }
        public ICollection<Guid> Users { get; private set; }

        public Account()
        {
            Apps = new HashSet<Application>();
            Users = new HashSet<Guid>();
        }

        public virtual Guid AddUser(Guid userId) 
        {
            Users.Add(userId);
            return userId;
        }

        public virtual Application CreateApp(string name, string key = null)
        {
            ShortGuid shortGuid = Guid.NewGuid();
            if (null != key) shortGuid = new ShortGuid(key);

            var app = new Application(name, shortGuid);
            
            Apps.Add(app);

            return app;
        }
    }
}