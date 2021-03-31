import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root',})
export class Socks 
{
    
    public sock_addr:string = "ws://192.168.0.30/ws";
    public ws:WebSocket = new WebSocket(this.sock_addr);
}