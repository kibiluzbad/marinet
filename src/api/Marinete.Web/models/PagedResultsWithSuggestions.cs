using System.Collections.Generic;
using System.Linq;

namespace Marinete.Web.Models
{
    public class PagedResultsWithSuggestions<TResult> : PagedResult<TResult>
    {
        private readonly IEnumerable<string> _sugestions;

        public IEnumerable<string> Sugestions
        {
            get
            {
                return !Data.Any() 
                    ? _sugestions 
                    : new List<string>();
            }
        }

        public PagedResultsWithSuggestions(IEnumerable<TResult> errors, 
            int totalSize,
            int currentPage, 
            int pageSize,
            IEnumerable<string> sugestions) 
            : base(errors, totalSize, currentPage, pageSize)
        {
            _sugestions = sugestions;
        }
    }
}