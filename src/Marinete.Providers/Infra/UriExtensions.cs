using System;

namespace Marinete.Common.Infra
{
    public static class UriExtensions
    {
        public static Uri Combine(this Uri baseUri, string urlFragment)
        {
            return new Uri(baseUri, urlFragment);
        }
    }
}