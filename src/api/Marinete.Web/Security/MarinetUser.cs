using System;
using System.Collections.Generic;
using Nancy.Security;

namespace Marinete.Web.Security
{
    public class MarinetUser : IUserIdentity
    {
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public IEnumerable<string> Claims { get; set; }

        public MarinetUser(string userName)
        {
            UserName = userName;
        }
    }
}