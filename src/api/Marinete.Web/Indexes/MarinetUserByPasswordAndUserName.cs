using System.Linq;
using Marinete.Web.Security;
using Raven.Client.Indexes;

namespace Marinete.Web.Indexes
{
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
}