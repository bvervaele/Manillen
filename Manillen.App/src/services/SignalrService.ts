import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Action, Message, OnlineUser, PrivateRoomMessage } from "../context/types";

export class SignalRService {

    private signalRConnection?: HubConnection;

    constructor(private username:string, private dispach: React.Dispatch<Action>) {}

    createUserRoomConnection() {
        this.signalRConnection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_API_URL + "hubs/connectionuser").withAutomaticReconnect().build();

        this.signalRConnection?.start().catch(error => console.log(error));

        this.signalRConnection?.on('UserConnected', () => {
            console.log('Server called here');
            this.addUserConnectionId();
        });

        this.signalRConnection?.on('OnlineUsers', (onlineusers: OnlineUser[]) => {
            // console.log(onlineusers);
            this.dispach({type:'SET_ONLINE_USERS', payload:onlineusers});
        });

        this.signalRConnection?.on('PrivateRoomUsers', (privateRoomUsers: string[]) => {
            // console.log(onlineusers);
            this.dispach({type:'SET_PRIVATE_ROOM_USERS', payload:privateRoomUsers});
        });

        this.signalRConnection?.on('InviteToPrivateRoomRequest', (message:Message) => {
            this.dispach({type:"REQUEST_PRIVATE_ROOM", payload: message});
            // console.log(message);
        });

        this.signalRConnection?.on('RejectPrivateRoomRequest', (message:Message) => {
            this.dispach({type:'REJECT_PRIVATE_ROOM_REQUEST', payload:message});
            // console.log(message);
        });

        this.signalRConnection?.on('OpenPrivateRoomRequest', (message:Message) => {
            this.dispach({type:'CREATE_PRIVATE_ROOM_REQUEST', payload:message});
            // console.log(message);
        });

        this.signalRConnection?.on('OpenPrivateRoom',(message:Message) => {
            this.dispach({type:'OPEN_PRIVATE_ROOM', payload:{from:message.to,to:message.from,content:message.content}});
        });

        this.signalRConnection?.on('ClosePrivateRoom', (message:Message) => {
            this.dispach({type:'CLOSE_PRIVATE_ROOM', payload:message});
        });

        this.signalRConnection?.on('NewPrivateMessage', (message:PrivateRoomMessage) => {
            this.dispach({type:'PRIVATE_ROOM_MESSAGE', payload:message});
        });

    }

    async removeUserCnnection() {
        return await this.signalRConnection?.stop().catch(error => console.log(error));
    }

    async addUserConnectionId() {
        return await this.signalRConnection?.invoke('AddUserConnectionId', this.username).catch(error => console.log(error));
    }

    async privateRoomRequest(message:Message){
        return await this.signalRConnection?.invoke('InviteToPrivateRoomRequest', message).catch(error => console.log(error));
    }
    
    async AcceptPrivateRoomRequest (message:Message){
        return await this.signalRConnection?.invoke('AcceptPrivateRoomRequest', message).catch(error => console.log(error));
    }

    async rejectPrivateRoomRequest (message:Message){
        return await this.signalRConnection?.invoke('RejectPrivateRoomRequest', message).catch(error => console.log(error));
    }

    async createPrivateRoom (message:Message){
        return await this.signalRConnection?.invoke('CreatePrivateRoom', message).catch(error => console.log(error));
    }

    async closePrivateRoom (message:Message){
        return await this.signalRConnection?.invoke('ClosePrivateRoom', message).catch(error => console.log(error));
    }

    async sendPrivateRooMessage(message:PrivateRoomMessage){
        return await this.signalRConnection?.invoke('SendPrivateRoomMessage', message).catch(error => console.log(error));
    }

    async createPrivateRoomRequest(message:Message){
        return await this.signalRConnection?.invoke('CreatePrivateRoomRequest', message).catch(error => console.log(error));
    }

    async joinPrivateRoomRequest(message:Message){
        return await this.signalRConnection?.invoke('JoinPrivateRoomRequest', message).catch(error => console.log(error));
    }

    async startGameRequest(message:Message){
        console.log("start game");
        return await this.signalRConnection?.invoke('StartRequest', message).catch(error => console.log(error));
    }
}