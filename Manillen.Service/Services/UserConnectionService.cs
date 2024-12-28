namespace Manillen.Service.Services
{
    public class UserConnectionService
    {
        //<key,value> = <username,ConnectionID>
        private static readonly Dictionary<string, string> Users = new Dictionary<string, string>();

        // add online connection with private room condition
        private static readonly Dictionary<string, bool> OnlineUsers = new Dictionary<string, bool>();

        private static readonly Dictionary<string, List<string>> PrivateRooms = new Dictionary<string, List<string>>();
        public bool AddUserToList(string userToAdd)
        {
            lock (Users)
            {
                foreach (var user in Users)
                {
                    if (user.Key.ToLower() == userToAdd.ToLower()) // if user name exsist
                        return false;
                }
                Users.Add(userToAdd, null);
                AddUserToOnlineUserList(userToAdd);
                return true;
            }
        }

        public void AddUserToOnlineUserList(string userToAdd)
        {
            lock (OnlineUsers)
            {
                OnlineUsers.Add(userToAdd, false);
            }
        }

        public void SetOnlineUserInPrivateRoom(string user)
        {
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(user))
                    OnlineUsers[user] = true;
            }
        }

        public void SetOnlineUserOutPrivateRoom(string user)
        {
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(user))
                    OnlineUsers[user] = false;
            }
        }

        public void RemoveOnlineUserFromList(string user)
        {
            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(user))
                    OnlineUsers.Remove(user);
            }
        }

        public void RemoveUserFromList(string user)
        {
            lock (Users)
            {
                if (Users.ContainsKey(user))
                {
                    Users.Remove(user);
                    RemoveOnlineUserFromList(user);
                }
            }
        }

        public void AddUserConnectionId(string user, string connectionId)
        {
            lock (Users)
            {
                bool res = Users.ContainsKey(user);
                if (res)
                {
                    Users[user] = connectionId;
                }
            }
        }

        public KeyValuePair<string, bool>[] GetOnlineUsers()
        {
            // lock(Users)
            // {
            //     return Users.OrderBy(x => x.Key).Select(x => x.Key).ToArray();
            // }
            lock (OnlineUsers)
            {
                return OnlineUsers.ToArray();
            }
        }

        public string GetUserConnectionById(string connectionId)
        {
            lock (Users)
            {
                var res = Users.Where(x => x.Value == connectionId).Select(x => x.Key).FirstOrDefault();
                return res;
            }
        }

        public string GetUserConnectionByUser(string user)
        {
            lock (Users)
            {
                return Users.Where(x => x.Key == user).Select(x => x.Value).FirstOrDefault();
            }
        }

        public void SetPrivateRoom(string key, string user)
        {
            if (!PrivateRooms.ContainsKey(key))
            {
                PrivateRooms[key] = new List<string>();
            }

            lock (PrivateRooms)
            {
                PrivateRooms[key].Add(user);
            }
        }

        public List<string> GetPrivateRoomUsers(string key)
        {
            lock (PrivateRooms)
            {
                 return PrivateRooms[key];
            }
        }

        public void AddUserToPrivateRoom(string key, string user)
        {
            if (!PrivateRooms.ContainsKey(key))
                return;

            lock (PrivateRooms)
            {
                PrivateRooms[key].Add(user);
            }
        }

        public void RemovePrivateRoom(string key)
        {
            if (PrivateRooms.ContainsKey(key))
            {
                PrivateRooms.Remove(key);
            }
        }

        public void RemoveUserFromPrivateRoom(string key, string user)
        {
            lock (PrivateRooms)
            {
                PrivateRooms[key].Remove(user);
            }
        }
    }
}