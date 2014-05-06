namespace Marinete.Common.Domain
{
    public class Application
    {
        public string Name { get; private set; }
        public string Key { get; private set; }

        public Application(string name, string key)
        {
            Name = name;
            Key = key;
        }
    }
}