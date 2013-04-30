using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Raven.Client.Indexes;

namespace Marinete.Common.Indexes
{
    public class UniqueVisitorsIndex : AbstractIndexCreationTask<Error, UniqueVisitorsIndex.UniqueError>
    {
        public class UniqueError
        {
            public string Message { get; set; }
            public Exception Exception { get; set; }
            public string AppName { get; set; }
            public DateTime CreatedAt { get; set; }
            public int Count { get; set; }
            public IEnumerable<string> Ids { get; set; }
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
                                  Count = 1,
                                  Ids = doc.Id
                              };
            Reduce = results => from result in results
                                group result by result.Message into g
                                select new
                                    {
                                        Message = g.Key,
                                        Count = g.Sum(x=>x.Count),
                                        AppName = g.Last().AppName,
                                        CreatedAt = g.Last().CreatedAt,
                                        Exception = g.Last().Exception,
                                        Ids = g.Select(c=>c.Ids)
                                    };
        }
    }
}