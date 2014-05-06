using System;
using Nancy;
using Nancy.Authentication.Forms;
using Nancy.Security;
using Raven.Client;

namespace Marinete.Web.Security
{
    public class MarinetUserMapper : IUserMapper
    {
        private readonly IDocumentSession _documentSession;

        public MarinetUserMapper(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        public IUserIdentity GetUserFromIdentifier(Guid identifier, NancyContext context)
        {
            var user = _documentSession.Load<MarinetUser>(identifier);
            return user;
        }
    }
}