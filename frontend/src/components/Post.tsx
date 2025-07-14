import { useState } from 'react';
import { format } from 'date-fns';
import Reply from './Reply';
import ReplyForm from './ReplyForm';
import useCommunity from '../context/CommunityContext';

const Post = ({ post }: { post: any }) => {
  const { currentUser, toggleLike, isFollowing } = useCommunity();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    if (currentUser) {
      toggleLike(post.id);
    }
  };

  const isLiked = post.likes.includes(currentUser?.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <div className="ml-4">
          <h3 className="font-bold text-lg">{post.userName}</h3>
          <p className="text-gray-500 text-sm">
            {format(post.timestamp, 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>
      
      <p className="mb-4">{post.content}</p>
      
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex space-x-4">
          <button 
            onClick={handleLike}
            className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <span className="mr-1">❤️</span>
            <span>{post.likes.length}</span>
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-gray-500 flex items-center"
          >
            <span className="mr-1">💬</span>
            <span>{post.replies.length}</span>
          </button>
        </div>
        
        {currentUser?.id !== post.userId && (
          <button 
            onClick={() => isFollowing(post.userId) ? unfollowUser(post.userId) : followUser(post.userId)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isFollowing(post.userId) 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-blue-500 text-white'
            }`}
          >
            {isFollowing(post.userId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      
      {showReplyForm && (
        <ReplyForm postId={post.id} onSuccess={() => setShowReplyForm(false)} />
      )}
      
      {post.replies.length > 0 && (
        <div className="mt-4">
          <button 
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-500 text-sm font-medium mb-2"
          >
            {showReplies ? 'Hide replies' : `Show ${post.replies.length} replies`}
          </button>
          
          {showReplies && (
            <div className="space-y-4 mt-2 pl-4 border-l-2 border-gray-200">
              {post.replies.map((reply: any) => (
                <Reply key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;