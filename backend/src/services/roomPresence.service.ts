export class RoomPresenceService {
  private static roomMap = new Map<string, Set<string>>();

  static join(roomId: string, socketId: string): number {
    if (!this.roomMap.has(roomId)) {
      this.roomMap.set(roomId, new Set());
    }
    this.roomMap.get(roomId)!.add(socketId);
    return this.roomMap.get(roomId)!.size;
  }

  static leave(roomId: string, socketId: string): number {
    if (this.roomMap.has(roomId)) {
      this.roomMap.get(roomId)!.delete(socketId);
      return this.roomMap.get(roomId)!.size;
    }
    return 0;
  }
}
