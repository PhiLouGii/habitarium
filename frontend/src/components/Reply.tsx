import { format } from 'date-fns';
import useCommunity from '../context/CommunityContext';

interface ReplyProps {
  reply: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: Date;
  };
}

const Reply = ({ reply }: ReplyProps) => {
  const { currentUser, isFollowing, followUser, unfollowUser } = useCommunity();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
        <div className="ml-3">
          <h4 className="font-medium">{reply.userName}</h4>
          <p className="text-gray-500 text-xs">
            {format(reply.timestamp, 'MMM d, h:mm a')}
          </p>
        </div>
        
        {currentUser?.id !== reply.userId && (
          <button 
            onClick={() => isFollowing(reply.userId) ? unfollowUser(reply.userId) : followUser(reply.userId)}
            className={`ml-auto px-2 py-1 rounded-full text-xs ${
              isFollowing(reply.userId) 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-blue-500 text-white'
            }`}
          >
            {isFollowing(reply.userId) ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      
      <p className="text-gray-700">{reply.content}</p>
    </div>
  );
};

export default Reply;