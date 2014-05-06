using System;

namespace Marinete.Common.Domain
{
    public class Comment
    {
        public string Message { get; private set; }
        public Guid UserId { get; private set; }

        public Comment(string message, Guid userId)
        {
            Message = message;
            UserId = userId;
        }
    }
}