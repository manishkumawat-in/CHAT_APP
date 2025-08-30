import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { UserContext } from "../context/userContext";
import { useLocation } from "react-router";

export default function Profile() {
  const location = useLocation();
  const { userData, updateProfile, updateImage, logout } =
    useContext(UserContext);

  const recievedData = location.state || {};

  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(recievedData.name);
  const [bio, setBio] = useState(recievedData.bio);

  const updateHandler = () => {
    if (isEditing) {
      updateProfile({ name, bio });
      setIsEditing(!isEditing);
    }
    setIsEditing(!isEditing);
  };

  const updateImageHandler = () => {
    if (image) {
      updateImage(image);
      setImage(null);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8"
      >
        <div className="flex justify-between mt-[-20px]">
          <a
            href="/"
            className="text-2xl bg-gray-200 px-2 rounded-full pb-[4px] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
          >
            ←
          </a>
          {recievedData._id == userData._id && (
            <button
              type="button"
              onClick={logout}
              className="border-red-500 border px-2  rounded-full text-red-500 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center ">
          {recievedData.image ? (
            <div className="rounded-full w-28 h-28 overflow-hidden border-4 border-blue-500">
              <img
                src={recievedData.image}
                alt="Profile"
                className="w-28 h-28 object-cover "
              />
            </div>
          ) : (
            <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center text-[35px] border-4 border-blue-500">
              <span>{recievedData.name.charAt(0).toUpperCase()}</span>
            </div>
          )}

          {userData._id == recievedData._id && (
            <div>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => setImage(e.target.files[0])}
              />
              <input
                type="text"
                value={image ? image.name : ""}
                placeholder="Change image"
                readOnly
                onClick={() => document.getElementById("profileImage").click()}
                className="mt-2 cursor-pointer text-sm border-none text-center outline-none text-gray-700 rounded hover: transition"
              />
              {image && (
                <button
                  type="button"
                  onClick={() => updateImageHandler(image)}
                  className="mt-2 px-2 py- bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Change
                </button>
              )}
            </div>
          )}
          <h2 className="mt-4 text-xl font-semibold">{recievedData.name}</h2>
          <p className="text-gray-600">{recievedData.email}</p>
          {recievedData._id == userData._id && (
            <button
              type="button"
              onClick={updateHandler}
              className="mt-3 cursor-pointer text-sm px-4 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              {isEditing ? "Save Changes" : "Edit Info"}
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 border rounded-xl">
            <User className="text-gray-500" size={20} />
            <input
              className="text-gray-700 border-none outline-none "
              disabled={isEditing === false}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="p-3 border rounded-xl">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Bio</h3>
            <input
              className="text-gray-700 border-none outline-none w-full"
              disabled={isEditing === false}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
