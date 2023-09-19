// Chat.tsx
import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const UserHub: React.FC = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [userGetAllCounter, setUserGetAllCounter] = useState<string>("");
   

    useEffect(() => {

        const newConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5102/user")
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                console.log("SignalR Connected");
            })
            .catch((error) => {
                console.log("SignalR Connection Error: " + error);
            });

            // Clean up the connection when the component unmounts
            return () => {
            
                        newConnection.on('ReceiveGetAllUserMessage', ( message: string) => {
                console.log("ReceiveGetAllUserMessage", message);
                            setUserGetAllCounter( message);
                
                        });
            console.log("unmounting");

          

            if (newConnection.state === 'Connected') {
                newConnection.stop();
            }
        };
    }, []);

   

    return (
        // develope by redux to hold state
        <div>
          <h4>count of calling api/user API:{userGetAllCounter}</h4>
        </div>
    );
};

export default UserHub;
