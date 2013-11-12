using System;
using System.Collections.Generic;
using System.Linq;
using Marinete.Common.Domain;
using Raven.Abstractions.Indexing;
using Raven.Client.Indexes;
using Raven.Database.Server.Responders;

namespace Marinete.Web.Indexes
{
    public class ErrorsGroupBySlugAndUser : AbstractIndexCreationTask<Error, ErrorsGroupBySlugAndUser.ErrorGroupedBySlugAndUser>
    {
        public class ErrorGroupedBySlugAndUser
        {
            public int Count { get; set; }
            public string Id { get; set; }
            public string Slug { get; set; }
            public string Exception { get; set; }
            public string Message { get; set; }
            public string OsVersion { get; set; }
            public string Platform { get; set; }
            public int Processors { get; set; }
            public string ServicePack { get; set; }
            public string AppName { get; set; }
            public DateTime CreatedAt { get; set; }
            public string CurrentUser { get; set; }
            public bool Solved { get; set; }
        }

        public ErrorsGroupBySlugAndUser()
        {

            Map = docs => from doc in docs
                          orderby doc.CreatedAt descending
                          select new
                          {
                              Solved = doc.Solved,
                              ServicePack = doc.ServicePack,
                              Processors = doc.Processors,
                              Platform = doc.Platform,
                              OsVersion = doc.OsVersion,
                              Message = doc.Message,
                              Exception = doc.Exception,
                              AppName = doc.AppName,
                              CreatedAt = doc.CreatedAt,
                              CurrentUser = doc.CurrentUser,
                              Slug = doc.Slug,
                              Id = doc.Id,
                              Count = 1

                          };
            Reduce = results => from result in results
                                orderby result.CreatedAt descending
                                group result by new
                                {
                                    result.Slug, 
                                    result.CurrentUser
                                } into g
                                select new
                                {
                                    Solved = g.First().Solved,
                                    ServicePack = g.First().ServicePack,
                                    Processors = g.First().Processors,
                                    Platform = g.First().Platform,
                                    OsVersion = g.First().OsVersion,
                                    Slug = g.Key.Slug,
                                    Exception = g.First().Exception,
                                    Message = g.First().Message,
                                    CurrentUser = g.Key.CurrentUser,
                                    AppName = g.First().AppName,
                                    CreatedAt = g.First().CreatedAt,
                                    Id = g.First().Id,
                                    Count = g.Sum(c => c.Count)
                                };
            
            Indexes.Add(x => x.AppName, FieldIndexing.NotAnalyzed);
            Indexes.Add(x => x.Slug, FieldIndexing.NotAnalyzed);
            Indexes.Add(x => x.CreatedAt, FieldIndexing.NotAnalyzed);
        }
    }

    public class UniqueMessageIndex : AbstractIndexCreationTask<Error, UniqueMessageIndex.UniqueError>
    {
        public class UniqueError
        {
            public string Message { get; set; }
            public string Slug { get; set; }
            public string Exception { get; set; }
            public string AppName { get; set; }
            public string CurrentUser { get; set; }
            public DateTime CreatedAt { get; set; }
            public int Count { get; set; }
            public string Id { get; set; }
            public bool Solved { get; set; }
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
                                  Slug = doc.Slug,
                                  Id = doc.Id,
                                  Solved = doc.Solved,
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
                                        Slug = g.First().Slug,
                                        Id = g.First().Id,
                                        Solved = g.First().Solved,
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