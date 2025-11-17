import VideoContainer from './VideoContainer';
import Reactions from './Reactions';
import Whiteboard from './Whiteboard';
import ChatPanel from './ChatPanel';
import SupportButton from './SupportButton';

export default function ClassroomPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 grid grid-cols-12 gap-4 p-4">
        {/* Main Video Area */}
        <div className="col-span-8">
          <VideoContainer />
        </div>

        {/* Sidebar */}
        <div className="col-span-4 flex flex-col gap-4">
          <div className="flex-1">
            <ChatPanel />
          </div>
          <div className="h-64">
            <Reactions />
          </div>
        </div>
      </div>

      {/* Whiteboard Section */}
      <div className="h-64 p-4">
        <Whiteboard />
      </div>

      {/* Support Button */}
      <SupportButton />
    </div>
  );
}

