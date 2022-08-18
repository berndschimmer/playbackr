import { Link } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";

const Settings = () => {
  return (
    <div className="configuration">
      <p>Playback im Dauerloop</p>
      <p>Todo: Switch</p>
      <Link to="/">
        <IoHomeSharp className="settings" />
      </Link>
    </div>
  );
};

export default Settings;
