import { handleJoinRoom } from "../utils/roomHandlers";

const Home = () => {
  return (
    <div>
      <h2>Start By Joining a Room</h2>
      <button onClick={(e) => handleJoinRoom(e.target.innerText.toLowerCase())}>
        Alpha
      </button>
      <button onClick={(e) => handleJoinRoom(e.target.innerText.toLowerCase())}>
        Bravo
      </button>
    </div>
  );
};

export default Home;
