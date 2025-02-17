export interface IMessageChannelState {
    messageChannel: MessageChannel;
    portOne: MessagePort;
    portTwo: MessagePort;
}
export class MessageChannelState implements IMessageChannelState {
    messageChannel: MessageChannel = new MessageChannel();
    portOne: MessagePort = this.messageChannel.port1;
    portTwo: MessagePort = this.messageChannel.port2;
    constructor() {
        // 创建 MessageChannel 对象
        // 获取 MessageChannel 的两个端口
    }
    
    destroyed() {
        this.portOne.close();
        this.portTwo.close();
    }
}
