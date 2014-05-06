using System.Linq;
using Marinete.Common.Domain;
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
}