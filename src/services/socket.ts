import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        this.disconnect();
      }
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  // Event listeners
  onComplaintCreated(callback: (data: any) => void): void {
    this.socket?.on("complaint:created", callback);
  }

  onComplaintUpdated(callback: (data: any) => void): void {
    this.socket?.on("complaint:updated", callback);
  }

  onComplaintAssigned(callback: (data: any) => void): void {
    this.socket?.on("complaint:assigned", callback);
  }

  onComplaintStatusChanged(callback: (data: any) => void): void {
    this.socket?.on("complaint:status-changed", callback);
  }

  onComplaintResolved(callback: (data: any) => void): void {
    this.socket?.on("complaint:resolved", callback);
  }

  onNotification(callback: (data: any) => void): void {
    this.socket?.on("notification", callback);
  }

  onTyping(
    callback: (data: { userId: string; complaintId: string }) => void
  ): void {
    this.socket?.on("typing", callback);
  }

  onStopTyping(
    callback: (data: { userId: string; complaintId: string }) => void
  ): void {
    this.socket?.on("stop-typing", callback);
  }

  // Event emitters
  emitTyping(complaintId: string): void {
    this.socket?.emit("typing", { complaintId });
  }

  emitStopTyping(complaintId: string): void {
    this.socket?.emit("stop-typing", { complaintId });
  }

  // Remove specific listeners
  offComplaintCreated(): void {
    this.socket?.off("complaint:created");
  }

  offComplaintUpdated(): void {
    this.socket?.off("complaint:updated");
  }

  offComplaintAssigned(): void {
    this.socket?.off("complaint:assigned");
  }

  offComplaintStatusChanged(): void {
    this.socket?.off("complaint:status-changed");
  }

  offComplaintResolved(): void {
    this.socket?.off("complaint:resolved");
  }

  offNotification(): void {
    this.socket?.off("notification");
  }

  offTyping(): void {
    this.socket?.off("typing");
  }

  offStopTyping(): void {
    this.socket?.off("stop-typing");
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

export default new SocketService();
