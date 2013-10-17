using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Marinete.Web.Security;
using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;
using Raven.Database.Server.Responders;

namespace Marinete.Web.Indexes
{
    public class ErrorsByIdAndAppName : AbstractIndexCreationTask<Error>
    {
        public ErrorsByIdAndAppName()
        {
            Map = docs => from doc in docs
                          select new {doc.Id, doc.AppName, doc.CreatedAt};
        }
    }

    public class MarinetUserByPasswordAndUserName : AbstractIndexCreationTask<MarinetUser>
    {
        public MarinetUserByPasswordAndUserName()
        {
            Map = docs => from doc in docs
                select new
                {
                    doc.Password,
                    doc.UserName
                };
        }
    }

    public class AccountByUsers : AbstractIndexCreationTask<Account>
    {
        public AccountByUsers()
        {
            Map = docs => from doc in docs
                          select new
                          {
                              doc.Users
                          };
        }
    }

    public class UniqueMessageIndex : AbstractIndexCreationTask<Error, UniqueMessageIndex.UniqueError>
    {
        public class UniqueError
        {
            public string Message { get; set; }
            public string Exception { get; set; }
            public string AppName { get; set; }
            public string CurrentUser { get; set; }
            public DateTime CreatedAt { get; set; }
            public int Count { get; set; }
            public string Id { get; set; }
        }

        public UniqueMessageIndex()
        {
            Map = docs => from doc in docs
                          orderby doc.CreatedAt descending 
                          select new
                              {
                                  Message = doc.Message,
                                  Exception = doc.Exception,
                                  AppName = doc.AppName,
                                  CreatedAt = doc.CreatedAt,
                                  CurrentUser = doc.CurrentUser,
                                  Id = doc.Id,
                                  Count = 1

                              };
            Reduce = results => from result in results
                                orderby result.CreatedAt descending 
                                group result by result.Message into g
                                select new
                                    {
                                        Message = g.Key,
                                        CurrentUser = g.First().CurrentUser,
                                        AppName = g.First().AppName,
                                        CreatedAt = g.First().CreatedAt,
                                        Exception = g.First().Exception,
                                        Id = g.First().Id,
                                        Count = g.Sum(c=>c.Count)
                                    };

            Indexes.Add(x => x.Message, FieldIndexing.Analyzed);
            Indexes.Add(x => x.AppName, FieldIndexing.NotAnalyzed);
            Indexes.Add(x => x.CreatedAt, FieldIndexing.NotAnalyzed);
            Indexes.Add(x => x.Exception, FieldIndexing.Analyzed);
        }
    }

    public class UniqueErrorComparer : IEqualityComparer<UniqueMessageIndex.UniqueError>
    {
        public bool Equals(UniqueMessageIndex.UniqueError x, UniqueMessageIndex.UniqueError y)
        {
            return x.CurrentUser == y.CurrentUser;
        }

        public int GetHashCode(UniqueMessageIndex.UniqueError obj)
        {
            return obj.CurrentUser.GetHashCode();
        }
    }
}