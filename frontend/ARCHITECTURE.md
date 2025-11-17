# BridgeLearn Frontend Architecture

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [Application Structure](#application-structure)
4. [State Management (Redux)](#state-management-redux)
5. [Routing Architecture](#routing-architecture)
6. [Component Hierarchy](#component-hierarchy)
7. [Data Flow](#data-flow)
8. [External Integrations](#external-integrations)
9. [Key Design Patterns](#key-design-patterns)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │              ErrorBoundary (Global)                 │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │         Redux Provider (Store)                │  │  │  │
│  │  │  │  ┌────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │      React Router (Navigation)         │  │  │  │  │
│  │  │  │  │  ┌──────────────────────────────────┐ │  │  │  │  │
│  │  │  │  │  │     App Component (Routes)       │ │  │  │  │  │
│  │  │  │  │  │  ┌────────────────────────────┐  │ │  │  │  │  │
│  │  │  │  │  │  │  ProtectedRoute           │  │ │  │  │  │  │
│  │  │  │  │  │  │  ┌──────────────────────┐ │  │ │  │  │  │  │
│  │  │  │  │  │  │  │  Layout / Pages     │ │  │ │  │  │  │  │
│  │  │  │  │  │  │  │  ┌────────────────┐ │ │  │ │  │  │  │  │
│  │  │  │  │  │  │  │  │  Components    │ │ │  │ │  │  │  │  │
│  │  │  │  │  │  │  │  └────────────────┘ │ │  │ │  │  │  │  │
│  │  │  │  │  │  │  └──────────────────────┘ │  │ │  │  │  │  │
│  │  │  │  │  │  └────────────────────────────┘  │ │  │  │  │  │
│  │  │  │  │  └──────────────────────────────────┘ │  │  │  │  │
│  │  │  │  └────────────────────────────────────────┘  │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   WebRTC     │  │  Socket.IO   │  │   Axios      │          │
│  │  (Real-time  │  │  (Real-time  │  │  (HTTP API   │          │
│  │   Video)     │  │   Chat/Data) │  │   Calls)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Node.js    │  │    Moodle    │  │   AWS S3     │          │
│  │   API Server │  │   (LMS)      │  │  (Storage)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Core Framework
- **React 19.1.1** - UI library
- **TypeScript** - Type safety
- **Vite 7.1.12** - Build tool and dev server

### State Management
- **Redux Toolkit 2.2.7** - State management
- **React-Redux 9.1.2** - React bindings

### Routing
- **React Router DOM 6.26.1** - Client-side routing

### Real-time Communication
- **Socket.IO Client 4.7.5** - WebSocket for chat, whiteboard, reactions
- **WebRTC** (Native Browser API) - Peer-to-peer video/audio

### Styling
- **Tailwind CSS 3.4.7** - Utility-first CSS
- **ShadCN/UI** - Component library (Radix UI primitives)
- **Framer Motion 11.3.19** - Animation library

### HTTP Client
- **Axios 1.7.7** - API requests

### Authentication (Placeholder)
- **AWS Amplify 6.0.4** - (Currently using mock auth)

### Utilities
- **Lucide React** - Icons
- **class-variance-authority** - Component variants
- **clsx** & **tailwind-merge** - Class name utilities

---

## Application Structure

```
frontend/
├── src/
│   ├── main.tsx                 # Entry point (Redux Provider, ErrorBoundary)
│   ├── App.tsx                  # Root component (Router, Routes, Login)
│   ├── index.css                # Global styles (Tailwind directives)
│   │
│   ├── components/              # React Components
│   │   ├── Layout.tsx           # Main layout (Sidebar, Header)
│   │   ├── ErrorBoundary.tsx    # Error handling
│   │   │
│   │   ├── Dashboard/           # Role-based dashboards
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TutorDashboard.tsx
│   │   │   └── ParentPortal.tsx
│   │   │
│   │   ├── LiveClassroom/       # Live classroom components
│   │   │   ├── ClassroomPage.tsx    # Main classroom container
│   │   │   ├── VideoContainer.tsx   # WebRTC video streams
│   │   │   ├── ChatPanel.tsx        # Real-time chat
│   │   │   ├── Whiteboard.tsx       # Collaborative whiteboard
│   │   │   ├── Reactions.tsx        # Emoji reactions
│   │   │   └── SupportButton.tsx    # Support request button
│   │   │
│   │   └── ui/                  # Reusable UI components
│   │       └── Button.tsx
│   │
│   ├── store/                   # Redux State Management
│   │   ├── index.ts             # Store configuration
│   │   ├── hooks.ts             # Typed Redux hooks
│   │   ├── userSlice.ts         # User/auth state
│   │   ├── classroomSlice.ts    # Classroom/WebRTC state
│   │   ├── chatSlice.ts         # Chat messages state
│   │   ├── reactionSlice.ts     # Reactions state
│   │   └── uiSlice.ts           # UI state (theme, modals, etc.)
│   │
│   ├── api/                     # API Client Functions
│   │   ├── classroom.ts          # Classroom API endpoints
│   │   ├── progress.ts          # Progress tracking API
│   │   └── moodle.ts            # Moodle integration API
│   │
│   ├── utils/                   # Utility Functions
│   │   ├── apiClient.ts         # Axios instance (interceptors)
│   │   ├── auth.ts              # Authentication (mock AWS Cognito)
│   │   ├── s3Uploader.ts        # AWS S3 file upload
│   │   └── cn.ts                # Class name utility
│   │
│   └── config/                  # Configuration
│       └── env.ts               # Environment variables
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## State Management (Redux)

### Store Structure

```
Redux Store
│
├── user (userSlice)
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   ├── loading: boolean
│   └── error: string | null
│
├── classroom (classroomSlice)
│   ├── sessionId: string | null
│   ├── participants: Participant[]
│   ├── localStream: MediaStream | null
│   ├── remoteStreams: { [peerId: string]: MediaStream }
│   ├── isVideoEnabled: boolean
│   ├── isAudioEnabled: boolean
│   ├── videoQuality: 'low' | 'medium' | 'high' | 'hd'
│   ├── whiteboardData: WhiteboardData
│   └── loading: boolean
│
├── chat (chatSlice)
│   ├── messages: ChatMessage[]
│   ├── unreadCount: number
│   └── isOpen: boolean
│
├── reaction (reactionSlice)
│   ├── reactions: Reaction[]
│   └── recentReactions: Reaction[]
│
└── ui (uiSlice)
    ├── theme: 'light' | 'dark'
    ├── sidebarOpen: boolean
    ├── modals: { [key: string]: boolean }
    └── notifications: Notification[]
```

### Redux Slices

#### 1. **userSlice.ts**
- Manages authentication state
- Actions: `setUser`, `clearUser`, `updateUser`
- Persists user to localStorage

#### 2. **classroomSlice.ts**
- Manages live classroom state
- Actions: `setSession`, `addParticipant`, `removeParticipant`, `setLocalStream`, `setRemoteStream`, `toggleVideo`, `toggleAudio`, `setVideoQuality`, `updateWhiteboard`
- Async thunks: `joinClassroom`, `leaveClassroom`

#### 3. **chatSlice.ts**
- Manages chat messages
- Actions: `addMessage`, `clearMessages`, `setUnreadCount`, `toggleChat`
- Socket.IO integration for real-time messages

#### 4. **reactionSlice.ts**
- Manages emoji reactions
- Actions: `sendReaction`, `clearReactions`
- Socket.IO integration for real-time reactions

#### 5. **uiSlice.ts**
- Manages UI state (theme, modals, sidebar)
- Actions: `setTheme`, `toggleSidebar`, `openModal`, `closeModal`, `addNotification`

---

## Routing Architecture

### Route Structure

```
/ (Root)
│
├── /login                          # Public route
│   └── LoginPage
│
└── /dashboard/*                    # Protected routes
    │
    ├── /dashboard/admin            # Admin Dashboard
    │   └── Layout → AdminDashboard
    │
    ├── /dashboard/student          # Student Dashboard
    │   └── Layout → StudentDashboard
    │
    ├── /dashboard/tutor            # Tutor Dashboard
    │   └── Layout → TutorDashboard
    │
    └── /dashboard/parent           # Parent Portal
        └── Layout → ParentPortal

└── /classroom/:sessionId           # Protected route
    └── ClassroomPage
        ├── VideoContainer
        ├── ChatPanel
        ├── Whiteboard
        ├── Reactions
        └── SupportButton
```

### Route Protection Flow

```
User Request
    │
    ▼
┌─────────────────┐
│  ProtectedRoute │
┌─────────────────┐
│ 1. Check Redux  │
│    state        │
│ 2. Check        │
│    localStorage │
└─────────────────┘
    │
    ├── Authenticated? ──YES──► Render Component
    │
    └── NO ────────────────────► Redirect to /login
```

### Lazy Loading Strategy

Heavy components are lazy-loaded to improve initial page load:

```typescript
// Lazy loaded components
const StudentDashboard = lazy(() => import('./components/Dashboard/StudentDashboard'));
const TutorDashboard = lazy(() => import('./components/Dashboard/TutorDashboard'));
const ParentPortal = lazy(() => import('./components/Dashboard/ParentPortal'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const ClassroomPage = lazy(() => import('./components/LiveClassroom/ClassroomPage'));

// Wrapped in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <StudentDashboard />
</Suspense>
```

---

## Component Hierarchy

### Application Tree

```
main.tsx
└── ErrorBoundary
    └── Redux Provider
        └── App.tsx
            └── BrowserRouter
                └── Routes
                    ├── /login → LoginPage
                    │
                    └── Protected Routes
                        │
                        ├── /dashboard/* → Layout
                        │   ├── Sidebar (Navigation)
                        │   ├── Header (User menu, theme toggle)
                        │   └── Dashboard Component
                        │       ├── StudentDashboard
                        │       ├── TutorDashboard
                        │       ├── ParentPortal
                        │       └── AdminDashboard
                        │
                        └── /classroom/:sessionId → ClassroomPage
                            ├── VideoContainer
                            │   ├── Local Video Stream
                            │   └── Remote Video Streams (Grid)
                            ├── ChatPanel
                            │   ├── Message List
                            │   └── Message Input
                            ├── Whiteboard
                            │   ├── Canvas
                            │   └── Toolbar
                            ├── Reactions
                            │   └── Reaction Buttons
                            └── SupportButton
```

### Layout Component Structure

```
Layout
│
├── Sidebar
│   ├── Logo
│   ├── Navigation Items (filtered by role)
│   │   ├── Admin Dashboard (admin only)
│   │   ├── Student Dashboard (student, admin)
│   │   ├── Tutor Dashboard (tutor, admin)
│   │   └── Parent Portal (parent, admin)
│   └── User Info
│
└── Main Content Area
    ├── Header
    │   ├── Theme Toggle (Light/Dark)
    │   ├── Notifications
    │   └── User Menu (Logout)
    │
    └── {children} (Dashboard or Classroom)
```

---

## Data Flow

### Authentication Flow

```
1. User enters credentials
   │
   ▼
2. LoginPage calls auth.signIn()
   │
   ▼
3. auth.ts validates credentials (mock)
   │
   ▼
4. Returns { user, token }
   │
   ▼
5. Dispatch setUser(user) → Redux
   │
   ▼
6. Save to localStorage
   │
   ▼
7. Redirect to role-based dashboard
   │
   ▼
8. ProtectedRoute checks auth
   │
   ▼
9. Render dashboard
```

### API Request Flow

```
Component
   │
   ▼
useAppDispatch() → Redux Action
   │
   ▼
API Function (api/classroom.ts, etc.)
   │
   ▼
apiClient.ts (Axios instance)
   │
   ├── Request Interceptor
   │   └── Add JWT token to headers
   │
   ▼
HTTP Request → Backend API
   │
   ▼
Response
   │
   ├── Success → Update Redux state → Component re-renders
   │
   └── Error (401) → Redirect to /login
```

### Real-time Data Flow (Socket.IO)

```
Component
   │
   ▼
Socket.IO Client Connection
   │
   ├── Join Room (classroom sessionId)
   │
   ├── Listen to Events
   │   ├── 'message' → dispatch(addMessage())
   │   ├── 'reaction' → dispatch(sendReaction())
   │   ├── 'whiteboard-update' → dispatch(updateWhiteboard())
   │   └── 'participant-joined' → dispatch(addParticipant())
   │
   └── Emit Events
       ├── 'send-message' → Backend → Broadcast to room
       ├── 'send-reaction' → Backend → Broadcast to room
       └── 'whiteboard-draw' → Backend → Broadcast to room
```

### WebRTC Flow

```
1. User joins classroom
   │
   ▼
2. Get user media (getUserMedia)
   │
   ▼
3. Create RTCPeerConnection
   │
   ▼
4. Add local stream tracks
   │
   ▼
5. Create offer → Send to signaling server (Socket.IO)
   │
   ▼
6. Receive answer from peer
   │
   ▼
7. Set remote description
   │
   ▼
8. ICE candidates exchange
   │
   ▼
9. Establish peer connection
   │
   ▼
10. Display remote stream in VideoContainer
```

---

## External Integrations

### Backend API (Node.js)

**Base URL**: `http://localhost:5000` (configurable via `VITE_API_URL`)

**Endpoints**:
- `/api/auth/*` - Authentication
- `/api/classroom/*` - Classroom management
- `/api/progress/*` - Progress tracking
- `/api/moodle/*` - Moodle integration

**Authentication**: JWT tokens in `Authorization: Bearer <token>` header

### Socket.IO Server

**URL**: `http://localhost:5000` (configurable via `VITE_SOCKET_URL`)

**Events**:
- `join-room` - Join classroom session
- `leave-room` - Leave classroom session
- `message` - Chat message
- `reaction` - Emoji reaction
- `whiteboard-update` - Whiteboard drawing
- `participant-joined` - New participant
- `participant-left` - Participant left

### Moodle LMS

**URL**: `http://localhost:8080` (configurable via `VITE_MOODLE_URL`)

**Integration**: API calls to fetch courses, assignments, grades

### AWS Services (Placeholder)

- **AWS Cognito**: Authentication (currently mocked)
- **AWS S3**: File uploads (via `s3Uploader.ts`)

---

## Key Design Patterns

### 1. **Container/Presentational Pattern**
- Components are primarily presentational
- Redux handles state management
- API calls abstracted to `api/` directory

### 2. **Custom Hooks Pattern**
- `useAppDispatch()` - Typed Redux dispatch
- `useAppSelector()` - Typed Redux selector

### 3. **Lazy Loading Pattern**
- Heavy components loaded on-demand
- Improves initial page load time
- Wrapped in `Suspense` with loading fallback

### 4. **Error Boundary Pattern**
- Global error boundary catches React errors
- Graceful error display
- Prevents entire app crash

### 5. **Protected Route Pattern**
- Authentication check before rendering
- Redirects to login if not authenticated
- Checks both Redux state and localStorage

### 6. **Role-Based Access Control (RBAC)**
- User roles: `admin`, `student`, `tutor`, `parent`
- Navigation filtered by role
- Route access controlled by role

### 7. **Real-time Synchronization**
- Socket.IO for chat, reactions, whiteboard
- WebRTC for peer-to-peer video/audio
- Redux actions dispatched on socket events

### 8. **Type Safety**
- TypeScript throughout
- Typed Redux hooks
- Type-safe API clients

---

## Environment Configuration

### Environment Variables

```bash
VITE_API_URL=http://localhost:5000      # Backend API URL
VITE_SOCKET_URL=http://localhost:5000   # Socket.IO server URL
VITE_MOODLE_URL=http://localhost:8080   # Moodle LMS URL
```

### Configuration File

`src/config/env.ts` centralizes:
- API URLs
- WebRTC settings
- AWS configuration
- Video quality presets

---

## Development Workflow

### Hot Module Replacement (HMR)
- Vite provides fast HMR
- Docker volume mounts enable live code updates
- Changes reflect immediately in browser

### State Persistence
- User state persisted to `localStorage`
- Restored on app initialization (`main.tsx`)
- Syncs with Redux store

### Error Handling
- Global ErrorBoundary catches React errors
- API errors handled by interceptors
- User-friendly error messages displayed

---

## Future Enhancements

1. **Real AWS Cognito Integration** - Replace mock auth
2. **Service Workers** - Offline support, caching
3. **WebRTC TURN Server** - For NAT traversal
4. **Recording** - Record classroom sessions
5. **Analytics** - User behavior tracking
6. **Testing** - Unit tests, integration tests
7. **Accessibility** - ARIA labels, keyboard navigation
8. **Internationalization** - Multi-language support

---

## Notes

- All user actions dispatch Redux actions
- Components use typed Redux hooks (`useAppDispatch`, `useAppSelector`)
- Lazy loading ensures fast initial page load
- Error boundaries prevent app crashes
- Protected routes ensure authenticated access
- Role-based navigation and access control
- Real-time features use Socket.IO and WebRTC

---

**Last Updated**: Current implementation
**Version**: 1.0.0

