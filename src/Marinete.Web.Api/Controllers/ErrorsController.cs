using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using Marinete.Common.Domain;
using Marinete.Web.Api.Filters;
using Raven.Client;
using Raven.Client.Indexes;

namespace Marinete.Web.Api.Controllers
{
    public class ErrorsController : ApiController
    {
        private readonly IDocumentSession _documentSession;

        public ErrorsController(IDocumentSession documentSession)
        {
            _documentSession = documentSession;
        }

        //
        // GET: Api/Errors/
        [HttpGet]
        public IList<UniqueVisitorsIndex.UniqueError> Index(string tokenKey)
        {
            var token = GetToken(tokenKey);

            return _documentSession.Query<UniqueVisitorsIndex.UniqueError,UniqueVisitorsIndex>()
                                   .Where(c => c.AppName == token.App.Name)
                                   .OrderByDescending(c => c.CreatedAt)
                                   .ToList();
        }

        //
        // GET: Api/Error/
        [HttpGet]
        public IList<Error> GetSameErrors(string tokenKey, string message)
        {
            var token = GetToken(tokenKey);

            return _documentSession.Query<Error>()
                                   .Where(c => c.AppName == token.App.Name && c.Message == message)
                                   .OrderByDescending(c => c.CreatedAt)
                                   .ToList();
        }

        private Token GetToken(string tokenKey)
        {
            var token = _documentSession.Load<Token>(tokenKey);

            if (null == token || token.Expired)
                throw new HttpResponseException(HttpStatusCode.Unauthorized);

            return token;
        }

        //
        // POST: Api/Error
        [HttpPost]
        public void Add(Error error)
        {
            string tokenKey = ""+Request.Headers.FirstOrDefault(c => c.Key == "tokenKey").Value.FirstOrDefault();
            error.CreatedAt = DateTime.Now;
            
            var token = GetToken(tokenKey);
            
            _documentSession.Store(error);
        }
    }

    public class UniqueVisitorsIndex : AbstractIndexCreationTask<Error, UniqueVisitorsIndex.UniqueError>
    {
        public class UniqueError
        {
            public string Message { get; set; }
            public Exception  Exception { get; set; }
            public string AppName { get; set; }
            public DateTime CreatedAt { get; set; }
            public int Count { get; set; }
        }

        public UniqueVisitorsIndex()
        {
            Map = docs => from doc in docs
                          select new
                          {
                              Message = doc.Message,
                              Exception = doc.Exception,
                              AppName = doc.AppName,
                              CreatedAt = doc.CreatedAt,
                              Count = 1
                          };
            Reduce = results => from result in results
                                group result by result.Message into g
                                select new
                                {
                                    Message = g.Key,
                                    Count = g.Sum(x=>x.Count),
                                    AppName = g.Last().AppName,
                                    CreatedAt = g.Last().CreatedAt,
                                    Exception = g.Last().Exception
                                };
        }
    }
}
