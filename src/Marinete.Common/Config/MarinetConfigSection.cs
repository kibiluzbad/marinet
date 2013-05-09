using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace Marinete.Common.Config
{
    public static class MarinetConfigurationHelper
    {
        public static MarinetConfig Get()
        {
            var configSection = (MarinetConfigSection) ConfigurationManager.GetSection("marinetConfig");
            return new MarinetConfig{ AppKey = configSection.AppKey, AppName = configSection.AppName, RootUrl = configSection.RootUrl};
        }
    }

    public class MarinetConfig
    {
        public string RootUrl { get; set; }

        public string AppName { get; set; }

        public string AppKey { get; set; }
    }

    internal class MarinetConfigSection : ConfigurationSection
    {
        // Create a "remoteOnly" attribute.
        [ConfigurationProperty("appKey", DefaultValue = "false", IsRequired = true)]
        public string AppKey
        {
            get
            {
                return (string)this["appKey"];
            }
            set
            {
                this["appKey"] = value;
            }
        }

        [ConfigurationProperty("appName", DefaultValue = "false", IsRequired = true)]
        public string AppName
        {
            get
            {
                return (string)this["appName"];
            }
            set
            {
                this["appName"] = value;
            }
        }

        [ConfigurationProperty("rootUrl", DefaultValue = "false", IsRequired = true)]
        public string RootUrl
        {
            get
            {
                return (string)this["rootUrl"];
            }
            set
            {
                this["rootUrl"] = value;
            }
        }
    }
}
