using System;

namespace Marinete.Providers.Domain
{
    public class Token
    {
        public string Value { get; set; }

        public DateTime ValidTo { get; set; }

        public Application App { get; set; }

        public bool Expired
        {
            get { return ValidTo < DateTime.Now; }
        }
    }
}