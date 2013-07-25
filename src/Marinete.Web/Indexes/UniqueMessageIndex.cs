using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;

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

    public class UniqueMessageIndex : AbstractIndexCreationTask<Error, UniqueMessageIndex.UniqueError>
    {
        public class UniqueError
        {
            public string Message { get; set; }
            public string Exception { get; set; }
            public string AppName { get; set; }
            public IEnumerable<string> CurrentUser { get; set; }
            public DateTime CreatedAt { get; set; }
            public int Count {
                get { return CurrentUser.Distinct().Count(); }

            }
            public IEnumerable<string> Ids { get; set; }
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
                                  Ids = doc.Id
                              };
            Reduce = results => from result in results
                                orderby result.CreatedAt descending 
                                group result by result.Message into g
                                select new
                                    {
                                        Message = g.Key,
                                        CurrentUser = g.Select(x=>x.CurrentUser),
                                        AppName = g.First().AppName,
                                        CreatedAt = g.First().CreatedAt,
                                        Exception = g.First().Exception,
                                        Ids = g.Select(c=>c.Ids)
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