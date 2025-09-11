import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { name, content, createdAt, isApproved, blog } = comment;
  const commentDate = new Date(createdAt);

  const { axios } = useAppContext();

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: comment._id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteComment = async () => {
    const comfirm = window.confirm(
      "Are you sure you want to delete this Comment?"
    );
    if (!comfirm) return;
    try {
      const { data } = await axios.post("/api/admin/delete-comment", {
        id: comment._id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <strong className="font-medium text-gray-600">Blog</strong>:{" "}
        {blog?.title || "N/A"}
        <br />
        <br />
        <strong className="font-medium text-gray-600">Name</strong>: {name}
        <br />
        <strong className="font-medium text-gray-600">Comment</strong>:{" "}
        {content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">
        {commentDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {!isApproved ? (
            <img
              onClick={approveComment}
              src={assets.tick_icon}
              alt="approve"
              className="w-5 hover:scale-150 transition-all cursor-pointer"
            />
          ) : (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Approved
            </p>
          )}
          <img
            src={assets.bin_icon}
            alt="delete"
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            onClick={deleteComment}
          />
        </div>
      </td>
    </tr>
  );
};

export default CommentTableItem;
