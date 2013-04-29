using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web.Http;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using Marinete.Web.Api.Filters;
using Raven.Client;

namespace Marinete.Web.Api.Controllers
{
    public class AccountController : ApiController
    {
        private readonly IDocumentSession _session;

        public AccountController(IDocumentSession session)
        {
            _session = session;
        }

        //
        // GET: /Api/Account/Token
        [HttpGet]
        public string GetToken(string appName, string appKey)
        {
            var account = _session.Query<Account>()
                                  .FirstOrDefault(c => c.Apps.Any(d=>d.Name == appName && d.Key == appKey));

            if(AccountNotFound(account))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            var token = new Token
                {
                    Value = (ShortGuid) Guid.NewGuid(),
                    ValidTo = DateTime.Now.AddMinutes(5),
                    App = account.Apps.FirstOrDefault(c=>c.Name == appName)
                };

            _session.Store(token, token.Value);

            return token.Value;
        }

        //
        // GET: /Api/Account/Apps
        [HttpGet]
        public IEnumerable<Application> GetApps()
        {
            //TODO: Tratar mais contas.
            var account = _session.Query<Account>()
                                  .FirstOrDefault();

            if (AccountNotFound(account))
                throw new HttpResponseException(HttpStatusCode.NotFound);

            
            return account.Apps;
        }

        //TODO: Esse metodo só deve ser chamado em contexto autenticado.
        //
        // POST: /Api/Account/App
        [HttpPost]
        public string AddApp(string appName)
        {
            //TODO: Tratar mais contas.
            var account = _session.Query<Account>().FirstOrDefault();

            if (AccountNotFound(account))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            Application app = account.Apps.FirstOrDefault(c => c.Name == appName);

            if (null != app) return app.Key;

            app = account.CreateApp(appName);

            return app.Key;
        }

        private bool AccountNotFound(Account account)
        {
            return null == account;
        }
    }
    
}