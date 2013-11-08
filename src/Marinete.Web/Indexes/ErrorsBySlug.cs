using System.Linq;
using Marinete.Common.Domain;
using Raven.Client.Indexes;

namespace Marinete.Web.Indexes
{
    public class ErrorsBySlug : AbstractIndexCreationTask<Error> 
    {
        public ErrorsBySlug() 
        {
            Map = docs => from doc in docs
                select new { doc.Slug, doc.Solved };
        }
    }
}