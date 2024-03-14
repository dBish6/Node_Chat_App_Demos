export default process.env.NODE_ENV === "production"
  ? "https://node-chat-demos-socketio.fly.dev/api"
  : "http://localhost:4000/api";
