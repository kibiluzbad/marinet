using System;

namespace Marinete.Providers.Domain
{
    public class Error
    {
        public string AppName { get; set; }
        public string OsVersion { get; set; }
        public string Message { get; set; }
        public int Processors { get; set; }
        public string Exception { get; set; }
        public string Platform { get; set; }
        public string ServicePack { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CurrentUser { get; set; }
    }
}