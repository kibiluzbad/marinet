using System.Linq;
using Marinete.Common.Domain;
using Raven.Client.Indexes;

namespace Marinete.Web.Indexes
{
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
}