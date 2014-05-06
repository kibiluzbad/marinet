using System.Net;
using Marinete.Common.Domain;

namespace Marinete.Provider40
{
    public interface IMarineteProvider
    {
        HttpStatusCode Error(Error error);
    }
}