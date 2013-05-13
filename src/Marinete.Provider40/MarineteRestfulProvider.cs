using System;
using System.Net;
using Marinete.Common.Config;
using Marinete.Common.Domain;
using Marinete.Common.Infra;
using RestSharp;

namespace Marinete.Provider40
{
    public class MarineteRestfulProvider : IMarineteProvider
    {
        private readonly IRestClient _client;
        private readonly ITokenAuthProvider _authProvider;
        private readonly MarinetConfig _config;
        
        public MarineteRestfulProvider(IRestClient client = null, 
            ITokenAuthProvider authProvider = null,
            MarinetConfig config = null)
        {
            _client = client ?? new RestClient();
            _authProvider = authProvider ?? new TokenAuthProvider(config: config);
            _config = config ?? MarinetConfigurationHelper.Get();
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
