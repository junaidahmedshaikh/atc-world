"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import type { Post } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    toast.success(liked ? "Post unliked" : "Post liked!");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Article":
        return "✍️";
      case "Education":
        return "🎓";
      case "Event":
        return "📅";
      case "Job":
        return "💼";
      default:
        return "📝";
    }
  };

  return (
    <div className="card mb-4 border-0 shadow-sm">
      {post.image && (
        <div className="position-relative" style={{ height: "220px" }}>
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover card-img-top"
          />
        </div>
      )}

      <div className="card-body">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-light text-dark">
            {getTypeIcon(post.type)} {post.type}
          </span>
        </div>

        <h5 className="card-title fw-bold mb-3">{post.title}</h5>
        <p className="card-text text-muted mb-3">{post.content}</p>

        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <img
                src={
                  post.author.avatar ||
                  "https://plus.unsplash.com/premium_photo-1688740375397-34605b6abe48?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmVtYWxlJTIwYXZhdGFyfGVufDB8fDB8fHww"
                }
                alt={post.author.name}
                className="rounded-circle"
                width="40"
                height="40"
              />
              <span className="fw-medium">{post.author.name}</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-1 text-muted">
              <Eye size={16} />
              <span className="small">{post.views} views</span>
            </div>
            <button className="btn btn-link p-0 text-muted">
              <Share2 size={16} />
            </button>
            <button className="btn btn-link p-0 text-muted">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        <hr className="my-3" />

        <div className="d-flex align-items-center gap-4">
          <button
            className={`btn btn-link p-0 d-flex align-items-center gap-2 ${
              liked ? "text-danger" : "text-muted"
            }`}
            onClick={handleLike}
          >
            <Heart size={18} fill={liked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>

          <button className="btn btn-link p-0 d-flex align-items-center gap-2 text-muted">
            <MessageCircle size={18} />
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
