using Manillen.Service.Models.Dto;
using Manillen.Service.Services;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace Manillen.Service.Hubs
{
    public class ConnectionUserHub : Hub
    {
        private readonly UserConnectionService _userConnectionService;
        public ConnectionUserHub(UserConnectionService userConnectionService)
        {
            _userConnectionService = userConnectionService;
        }

        public override async Task OnConnectedAsync()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "TicTactToeHub");
            await Clients.Caller.SendAsync("UserConnected");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "TicTactToeHub");

            var user = _userConnectionService.GetUserConnectionById(Context.ConnectionId);
            if (user != null)
            {
                _userConnectionService.RemoveUserFromList(user);
                _userConnectionService.RemoveOnlineUserFromList(user);
                //_userConnectionService.RemoveUserFromPrivateRoom(user);
            }

            await DisplayOnlineUsers();
            await base.OnDisconnectedAsync(exception);
        }

        public async Task AddUserConnectionId(string name)
        {
            _userConnectionService.AddUserConnectionId(name, Context.ConnectionId);
            await DisplayOnlineUsers();
        }

        public async Task DisplayOnlineUsers()
        {
            var onlineUsers = _userConnectionService.GetOnlineUsers();
            await Clients.Groups("TicTactToeHub").SendAsync("OnlineUsers", onlineUsers);
        }

        public async Task InviteToPrivateRoomRequest(MessageDto message)
        {
            var requestUserConnectionId = _userConnectionService.GetUserConnectionByUser(message.To);
            if (requestUserConnectionId != null)
            {
                await Clients.Client(requestUserConnectionId).SendAsync("InviteToPrivateRoomRequest", message);
            }
        }

        public async Task JoinPrivateRoomRequest(MessageDto message)
        {
            if (message != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, message.Content);
                _userConnectionService.AddUserToPrivateRoom(message.Content, message.From);
                var partyUsers = Clients.Group(message.Content);
                await Clients.Groups(message.Content).SendAsync("JoinPrivateRoom", partyUsers);
            }
        }

        public async Task RejectPrivateRoomRequest(MessageDto message)
        {
            if (message != null)
            {
                var requestUserConnectionId = _userConnectionService.GetUserConnectionByUser(message.To);
                if (requestUserConnectionId != null)
                    await Clients.Client(requestUserConnectionId).SendAsync("RejectPrivateRoomRequest", message);
            }
        }

        public async Task CreatePrivateRoomRequest(MessageDto message)
        {
            if (message != null)
            {
                string privateRoomName = GetPrivateGroupRoom();
                await Groups.AddToGroupAsync(Context.ConnectionId, privateRoomName);

                _userConnectionService.SetOnlineUserInPrivateRoom(message.From);

                _userConnectionService.SetPrivateRoom(privateRoomName, message.From);

                await DisplayOnlineUsers();

                // open private room
                await Clients.Client(Context.ConnectionId).SendAsync("OpenPrivateRoom", message);
            }
        }

        ////TODO
        //public async Task ClosePrivateRoom(MessageDto message)
        //{
        //    if (message != null)
        //    {
        //        string privateRoomName = GetPrivateGroupRoom(message.From, message.To);

        //        await Clients.Group(privateRoomName).SendAsync("ClosePrivateRoom", message);

        //        await Groups.RemoveFromGroupAsync(Context.ConnectionId, privateRoomName);
        //        _userConnectionService.SetOnlineUserOutPrivateRoom(message.From);
        //        _userConnectionService.SetOnlineUserOutPrivateRoom(message.To);

        //        _userConnectionService.RemovePrivateRoom(privateRoomName);

        //        if (message.Content == "ClosePrivateRoom")
        //        {
        //            await DisplayOnlineUsers();
        //        }
        //        var toConnectionId = _userConnectionService.GetUserConnectionByUser(message.To);
        //        await Groups.RemoveFromGroupAsync(toConnectionId, privateRoomName);
        //    }
        //}

        private string GetPrivateGroupRoom()
        {
            const string allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            const int codeLength = 6;

            Random random = new Random();
            char[] code = new char[codeLength];

            for (int i = 0; i < codeLength; i++)
            {
                code[i] = allowedChars[random.Next(0, allowedChars.Length)];
            }

            return new string(code);
        }
    }
}
