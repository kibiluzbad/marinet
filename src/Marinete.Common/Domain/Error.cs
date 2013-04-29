using System;

namespace Marinete.Common.Domain
{
    public class Error
    {
        public string Id { get; set; }
        public string AppName { get; set; }
        public string OsVersion { get; set; }
        public string Message { get; set; }
        public int Processors { get; set; }
        public Exception Exception { get; set; }
        public string Platform { get; set; }
        public string ServicePack { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CurrentUser { get; set; }
    }
}