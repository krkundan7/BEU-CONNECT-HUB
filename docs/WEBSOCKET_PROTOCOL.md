# Real-Time WebSocket Protocol & Event Catalog

## Connection Lifecycle
1. Client connects with JWT bearer token in handshake auth payload.
2. Server validates token, joins user to personal room (`user:{userId}`) and branch room (`branch:{branchCode}:{semester}`).
3. Heartbeat ping/pong every 25 seconds to maintain active presence state.

## Supported Events
| Event Name | Direction | Payload Description |
|---|---|---|
| `notice:new_broadcast` | Server -> Client | Official BEU notice release notification |
| `message:direct_send` | Client -> Server | Instant peer-to-peer or mentor direct message |
| `study:streak_updated` | Server -> Client | Daily learning streak milestone reached |
| `room:typing_status` | Bi-directional | Active peer typing indicator in community channel |
