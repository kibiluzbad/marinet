using System.Net;
using Marinete.Common.Domain;

namespace Marinete.Providers
{
    public interface IMarineteProvider
    {
        HttpStatusCode Error(Error error);
    }
}