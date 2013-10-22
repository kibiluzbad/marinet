using System;
using System.Collections.Generic;

namespace Marinete.Web.Models 
{
    public class PagedResult<TObj> 
    {
        private readonly int _totalSize;
        private readonly int _currentPage;
        private readonly int _pageSize;
        private readonly int _totalPages;

        public int TotalPages {
            get { return _totalPages; }
        }

        public int PageSize {
            get { return _pageSize; }
        }

        public int CurrentPage {
            get { return _currentPage; }
        }

        public int TotalSize {
            get { return _totalSize; }
        }

        public IEnumerable<TObj> Data { get; protected set; }

        public PagedResult(IEnumerable<TObj> errors, int totalSize, int currentPage, int pageSize) {
            _totalSize = totalSize;
            _currentPage = currentPage;
            _pageSize = pageSize;
            _totalPages = (int)Math.Ceiling((decimal)TotalSize / PageSize);
            Data = errors;
        }
    }
}