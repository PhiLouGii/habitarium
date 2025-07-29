import { useState } from 'react';
import useCommunity from '../context/CommunityContext';

interface ReplyFormProps {
  postId: string;
  onSuccess: () => void;
}

const ReplyForm = ({ postId, onSuccess }: ReplyFormProps) => {
  const [content, setContent] = useState('');
  const { createReply } = useCommunity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    try {
      await createReply(postId, content);
      setContent('');
      onSuccess();
    } catch (error) {
      console.error('Failed to post reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        required
      />
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Post Reply
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;