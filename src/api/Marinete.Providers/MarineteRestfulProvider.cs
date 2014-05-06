using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Marinete.Providers.Domain;
using Marinete.Providers.Infra;
using RestSharp;

namespace Marinete.Providers
{
    public class MarineteRestfulProvider : IMarineteProvider
    {
        private readonly IRestClient _client;
        private readonly ITokenAuthProvider _authProvider;
        private readonly MarineteConfig _config;

        public MarineteRestfulProvider(IRestClient client = null, 
            ITokenAuthProvider authProvider = null,
            MarineteConfig config = null)
        {
            _client = client ?? new RestClient();
            _authProvider = authProvider ?? new TokenAuthProvider(config: config);
            _config = config;
        }

        public HttpStatusCode Error(Error error)
        {
            var uri = new Uri(_config.RootUrl).Combine("api/error");
            var request = new RestRequest(uri.ToString(), Method.POST){RequestFormat = DataFormat.Json};
            

            request.AddHeader("tokenKey", _authProvider.GetToken());
            request.AddObject(error);

            IRestResponse response = _client.Execute(request);

            return response.StatusCode;
        }
    }
}
