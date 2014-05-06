using System;
using System.Net;
using Marinete.Common.Config;
using Marinete.Common.Infra;
using RestSharp;

namespace Marinete.Provider40
{
    public class TokenAuthProvider : ITokenAuthProvider
    {
        private readonly IRestClient _client;
        private readonly MarinetConfig _config;

        public TokenAuthProvider(IRestClient client = null,
                                 MarinetConfig config = null)
        {
            _client = client ?? new RestClient();
            _config = config ?? MarinetConfigurationHelper.Get();
        }

        public string GetToken()
        {
            var uri = new Uri(_config.RootUrl).Combine("api/account/token").ToString();
            var request = new RestRequest(uri, Method.GET){RequestFormat = DataFormat.Json};

            request.AddParameter("appName", _config.AppName);
            request.AddParameter("appKey", _config.AppKey);

            IRestResponse response = _client.Execute(request);

            if (HttpStatusCode.OK != response.StatusCode)
                throw new ApplicationException(string.Format("{0}: {1}",response.StatusCode,response.StatusDescription));

            return response.Content.Replace("\"",string.Empty);
        }
    }
}