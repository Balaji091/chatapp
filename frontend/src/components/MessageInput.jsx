import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false); // Local state to track sending status
  const fileInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("No file selected!");
      return;
    }
    console.log("Selected file:", file);
    setImageFile(file); // Set file immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // Ensure message or image is present
    if (!text.trim() && !imageFile) {
      toast.error("Cannot send an empty message!");
      return;
    }

    setIsSending(true); // Disable the send button immediately

    try {
      // Send a plain object; the store converts it to FormData.
      await sendMessage({ text: text.trim(), image: imageFile });
      // Clear form fields
      setText("");
      removeImage();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false); // Re-enable the send button after sending
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSendingMessage || isSending} // Disable file input while sending
          />
          <button
            type="button"
            className={`btn btn-circle text-zinc-400 ${
              isSendingMessage || isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSendingMessage || isSending} // Disable image upload button while sending
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imagePreview) || isSending} // Disable send button while sending
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;