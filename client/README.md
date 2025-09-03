# Social Media App - React + MERN Stack

A full-stack social media application built with React.js and MERN stack.

## Features

- User authentication and authorization
- Create, edit, and delete posts
- Like and comment on posts
- User profiles and connections
- Real-time messaging
- Post sharing and discovery
- **Optimized Performance** - Instant like/comment updates

## Performance Improvements

This app includes advanced performance optimizations:

- **Optimistic Updates**: UI updates instantly without waiting for API responses
- **Memoization**: Uses React.useCallback and useMemo for optimal rendering
- **Instant Feedback**: Like and comment actions are immediate
- **Smooth UX**: No more lag when interacting with posts

See [README_PERFORMANCE.md](./README_PERFORMANCE.md) for detailed performance analysis.

## Post Share Feature

Enhanced post sharing with automatic redirect after login:

- Share posts via public URLs
- Automatic post highlighting in feed after login
- Seamless user experience

See [README_POST_SHARE.md](./README_POST_SHARE.md) for implementation details.

## Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Clerk
- **Real-time**: Server-Sent Events (SSE)

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run development server: `npm run dev`

## Performance Testing

Use React DevTools Profiler to monitor performance improvements:

```bash
# Install React DevTools
npm install -g react-devtools

# Run profiler
react-devtools
```

## Contributing

Follow performance best practices:
- Use optimistic updates for user actions
- Memoize expensive calculations
- Avoid unnecessary re-renders
- Implement proper error handling with fallbacks
