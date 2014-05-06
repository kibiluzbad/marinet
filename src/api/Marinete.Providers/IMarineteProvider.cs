using System.Net;
using Marinete.Providers.Domain;

namespace Marinete.Providers
{
    public interface IMarineteProvider
    {
        HttpStatusCode Error(Error error);
    }
}