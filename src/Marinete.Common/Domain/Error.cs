using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace Marinete.Common.Domain
{
    public class Error
    {
        public string Id { get; set; }
        public string AppName { get; set; }
        public string OsVersion { get; set; }
        public string Message { get; set; }
        public int Processors { get; set; }
        public string Exception { get; set; }
        public string Platform { get; set; }
        public string ServicePack { get; set; }
        public string CurrentUser { get; set; }
        public DateTime CreatedAt { get; private set; }
        public bool Solved { get; set; }
        public ICollection<Comment> Comments { get; private set; }

        public Error()
        {
            Comments = new Collection<Comment>();
            CreatedAt = DateTime.Now;
            Solved = false;
        }

        public void AddComment(string message, Guid userId)
        {
            var comment = new Comment(message, userId);
            Comments.Add(comment);
        }

        public void Solve()
        {
            Solved = !Solved;
        }
    }
}