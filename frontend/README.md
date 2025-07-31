# AI Models Dashboard

A modern, dark-themed web interface for showcasing and interacting with various AI models including sentiment analysis, image generation, caption-to-image, and RAG chatbot functionality.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [API Integration](#api-integration)
- [Architecture](#architecture)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

### 🎨 User Interface
- **Dark Theme**: Modern dark UI with `#1a1a1a` background
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Loading states, hover effects, and transitions
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

### 🤖 AI Model Integration
- **Sentiment Analysis**: Text emotion analysis using Transformer models
- **GAN Image Generation**: Random image creation with GANs
- **GLIDE Text-to-Image**: Caption-based image generation
- **RAG Chatbot**: Conversational AI with retrieval-augmented generation

### 🛡️ Error Handling
- **Comprehensive Error Types**: Network, timeout, validation, server errors
- **User-Friendly Messages**: Clear, actionable error feedback
- **Graceful Degradation**: Fallback to mock mode when APIs unavailable
- **Retry Mechanisms**: Smart retry functionality with visual feedback

### 🧪 Testing & Development
- **Mock API Toggle**: Switch between real and mock APIs
- **Input Validation**: Character limits and format validation
- **Loading States**: Consistent loading indicators
- **Error Recovery**: Easy retry and error clearing

## 🏗️ Project Structure

\`\`\`
ai-models-dashboard/
├── README.md                    # This file
├── package.json                 # Dependencies and scripts
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── Dockerfile                   # Docker configuration
├── .env.example                 # Environment variables template
├── .dockerignore               # Docker ignore file
│
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with providers
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Landing page (2x2 model grid)
│   ├── sentiment/              # Sentiment Analysis
│   │   └── page.tsx
│   ├── image-generator/        # GAN Random Image Generator
│   │   └── page.tsx
│   ├── caption-to-image/       # GLIDE Text-to-Image
│   │   └── page.tsx
│   └── chatbot/                # RAG Chatbot
│       └── page.tsx
│
├── components/                 # Reusable UI Components
│   ├── ui/                     # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── switch.tsx
│   │   └── label.tsx
│   ├── error-display.tsx       # Error display component
│   └── mock-api-toggle.tsx     # Mock API toggle switch
│
├── lib/                        # Core Libraries
│   ├── api/                    # API Integration Layer
│   │   ├── clients/            # Individual API clients
│   │   │   ├── sentiment.ts    # Sentiment Analysis API
│   │   │   ├── gan.ts          # GAN Image Generation API
│   │   │   ├── glide.ts        # GLIDE Text-to-Image API
│   │   │   └── rag.ts          # RAG Chatbot API
│   │   ├── config.ts           # API configuration
│   │   ├── errors.ts           # Error handling
│   │   └── types.ts            # API type definitions
│   └── utils.ts                # General utilities
│
├── hooks/                      # Custom React Hooks
│   └── use-api-error.ts        # Error handling hook
│
├── contexts/                   # React Contexts
│   └── mock-api-context.tsx    # Mock API state management
│
├── config/                     # Configuration Files
│   ├── env.ts                  # Environment variables
│   └── constants.ts            # Application constants
│
└── public/                     # Static Assets
    └── sample_gan.png          # Sample image for mock mode
\`\`\`

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Docker**: Optional, for containerization

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository-url>
   cd ai-models-dashboard
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Configure environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit \`.env.local\` with your API configurations (see [Environment Configuration](#environment-configuration))

4. **Run the development server:**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Environment Configuration

### Required Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Sentiment Analysis API
NEXT_PUBLIC_SENTIMENT_API_URL=http://localhost:5001
NEXT_PUBLIC_SENTIMENT_API_KEY=your_sentiment_api_key_here

# GAN Image Generation API
NEXT_PUBLIC_GAN_API_URL=http://localhost:5002
NEXT_PUBLIC_GAN_API_KEY=your_gan_api_key_here

# GLIDE Text-to-Image API
NEXT_PUBLIC_GLIDE_API_URL=http://localhost:8000
NEXT_PUBLIC_GLIDE_API_KEY=your_glide_api_key_here

# RAG Chatbot API
NEXT_PUBLIC_RAG_API_URL=http://localhost:5004
NEXT_PUBLIC_RAG_API_KEY=your_rag_api_key_here

# Optional Configuration
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENABLE_MOCK_MODE=true
\`\`\`

### Environment Variable Usage

Each API client automatically loads its specific environment variables:

- **Sentiment API**: Uses \`NEXT_PUBLIC_SENTIMENT_API_URL\` and \`NEXT_PUBLIC_SENTIMENT_API_KEY\`
- **GAN API**: Uses \`NEXT_PUBLIC_GAN_API_URL\` and \`NEXT_PUBLIC_GAN_API_KEY\`
- **GLIDE API**: Uses \`NEXT_PUBLIC_GLIDE_API_URL\` and \`NEXT_PUBLIC_GLIDE_API_KEY\`
- **RAG API**: Uses \`NEXT_PUBLIC_RAG_API_URL\` and \`NEXT_PUBLIC_RAG_API_KEY\`

### Docker Environment Variables

For Docker deployment, pass environment variables at runtime:

\`\`\`bash
docker run -p 3000:3000 \\
  -e NEXT_PUBLIC_SENTIMENT_API_URL=http://your-backend:5001 \\
  -e NEXT_PUBLIC_SENTIMENT_API_KEY=your_key \\
  -e NEXT_PUBLIC_GAN_API_URL=http://your-backend:5002 \\
  -e NEXT_PUBLIC_GAN_API_KEY=your_key \\
  ai-models-dashboard
\`\`\`

## 🔌 API Integration

### Architecture Overview

The API integration follows a modular architecture:

1. **Individual API Clients** (\`lib/api/clients/\`): Each AI model has its own client
2. **Centralized Configuration** (\`lib/api/config.ts\`): API endpoints and settings
3. **Error Handling** (\`lib/api/errors.ts\`): Comprehensive error management
4. **Type Definitions** (\`lib/api/types.ts\`): TypeScript interfaces

### API Client Structure

Each API client follows this pattern:

\`\`\`typescript
// lib/api/clients/example.ts
import { ApiClient } from '../config'
import { ExampleRequest, ExampleResponse } from '../types'

export class ExampleApiClient extends ApiClient {
  private static readonly API_URL = process.env.NEXT_PUBLIC_EXAMPLE_API_URL!
  private static readonly API_KEY = process.env.NEXT_PUBLIC_EXAMPLE_API_KEY

  static async performAction(data: ExampleRequest): Promise<ExampleResponse> {
    return this.makeRequest(this.API_URL + '/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.getHeaders(this.API_KEY)
    })
  }
}
\`\`\`

### Supported APIs

#### 1. Sentiment Analysis API

**Endpoint**: \`POST /predict\`

**Request**:
\`\`\`json
{
  "text": "I love this product!"
}
\`\`\`

**Response**:
\`\`\`json
{
  "sentiment": "Positive",
  "confidence": 0.89
}
\`\`\`

**Integration**:
\`\`\`typescript
import { SentimentApiClient } from '@/lib/api/clients/sentiment'

const result = await SentimentApiClient.analyzeSentiment("Hello world!")
console.log(result.sentiment) // "Positive"
\`\`\`

#### 2. GAN Image Generation API

**Endpoint**: \`GET /generate\`

**Response**:
\`\`\`json
{
  "file": "generated_image_123.png"
}
\`\`\`

**Integration**:
\`\`\`typescript
import { GANApiClient } from '@/lib/api/clients/gan'

const result = await GANApiClient.generateRandomImage()
console.log(result.imageUrl) // Full image URL
\`\`\`

#### 3. GLIDE Text-to-Image API

**Endpoint**: \`POST /predict\`

**Request**:
\`\`\`json
{
  "text": "A sunset over mountains"
}
\`\`\`

**Response**:
\`\`\`json
{
  "generated_image_url": "http://localhost:8000/generated_image_456.png"
}
\`\`\`

**Integration**:
\`\`\`typescript
import { GLIDEApiClient } from '@/lib/api/clients/glide'

const result = await GLIDEApiClient.generateImageFromText("A beautiful sunset")
console.log(result.imageUrl) // Generated image URL
\`\`\`

#### 4. RAG Chatbot API

**Endpoint**: \`POST /ask\`

**Request**:
\`\`\`json
{
  "question": "What is machine learning?"
}
\`\`\`

**Response**:
\`\`\`json
{
  "response": "Machine learning is...",
  "sources": ["doc1.pdf", "doc2.pdf"]
}
\`\`\`

**Integration**:
\`\`\`typescript
import { RAGApiClient } from '@/lib/api/clients/rag'

const result = await RAGApiClient.askQuestion("What is AI?")
console.log(result.response) // AI response
console.log(result.sources) // Source documents
\`\`\`

## 🏛️ Architecture

### Component Architecture

- **Pages** (\`app/\`): Route-based pages using Next.js App Router
- **Components** (\`components/\`): Reusable UI components
- **Hooks** (\`hooks/\`): Custom React hooks for state management
- **Contexts** (\`contexts/\`): Global state management
- **API Layer** (\`lib/api/\`): Modular API integration

### State Management

- **Mock API Toggle**: Global context for switching between mock and real APIs
- **Error Handling**: Custom hook for consistent error management
- **Loading States**: Integrated with API clients for seamless UX

### Error Handling Strategy

1. **Input Validation**: Client-side validation before API calls
2. **Network Errors**: Timeout, connection, and HTTP error handling
3. **User Feedback**: Clear error messages with retry options
4. **Graceful Degradation**: Fallback to mock mode when APIs fail

## 🛠️ Development

### Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
\`\`\`

### Code Style

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)
- **Modular Architecture**: Separation of concerns

### Adding New API Integrations

1. **Create API Client**:
   \`\`\`typescript
   // lib/api/clients/new-api.ts
   export class NewApiClient extends ApiClient {
     // Implementation
   }
   \`\`\`

2. **Add Environment Variables**:
   \`\`\`env
   NEXT_PUBLIC_NEW_API_URL=http://localhost:PORT
   NEXT_PUBLIC_NEW_API_KEY=your_api_key
   \`\`\`

3. **Create Page Component**:
   \`\`\`typescript
   // app/new-feature/page.tsx
   import { NewApiClient } from '@/lib/api/clients/new-api'
   \`\`\`

4. **Add to Navigation**:
   Update the main page with the new model tile.

## 🐳 Docker Deployment

### Building the Image

\`\`\`bash
# Build the Docker image
docker build -t ai-models-dashboard .

# Or use npm script
npm run docker:build
\`\`\`

### Running the Container

\`\`\`bash
# Basic run
docker run -p 3000:3000 ai-models-dashboard

# With environment variables
docker run -p 3000:3000 \\
  -e NEXT_PUBLIC_SENTIMENT_API_URL=http://your-backend:5001 \\
  -e NEXT_PUBLIC_SENTIMENT_API_KEY=your_key \\
  ai-models-dashboard

# Or use npm script
npm run docker:run
\`\`\`

### Docker Compose (Optional)

\`\`\`yaml
version: '3.8'
services:
  ai-dashboard:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SENTIMENT_API_URL=http://sentiment-api:5001
      - NEXT_PUBLIC_GAN_API_URL=http://gan-api:5002
      - NEXT_PUBLIC_GLIDE_API_URL=http://glide-api:8000
      - NEXT_PUBLIC_RAG_API_URL=http://rag-api:5004
\`\`\`

## 🧪 Testing

### Mock Mode Testing

The application includes a comprehensive mock mode for testing without backend dependencies:

1. **Enable Mock Mode**: Toggle the switch in the top-right corner
2. **Test All Features**: All AI models work with realistic mock data
3. **Error Simulation**: Test error handling with invalid inputs

### Manual Testing Checklist

- [ ] Landing page loads with 2x2 grid
- [ ] Mock API toggle works
- [ ] All model pages accessible
- [ ] Input validation works
- [ ] Error handling displays correctly
- [ ] Loading states show properly
- [ ] Responsive design on mobile
- [ ] Dark theme consistent throughout

### API Integration Testing

1. **Set up backend services** on specified ports
2. **Configure environment variables** with real API URLs
3. **Disable mock mode** using the toggle
4. **Test each model** with real API calls
5. **Verify error handling** with invalid requests

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

**Problem**: API calls fail with "undefined" URLs

**Solution**:
- Ensure \`.env.local\` exists in root directory
- Verify all required variables are set
- Restart development server after changes
- Check variable names match exactly (case-sensitive)

#### 2. CORS Errors

**Problem**: Browser blocks API requests

**Solution**:
- Configure CORS headers on your backend
- Use proper API URLs (not localhost in production)
- Ensure API endpoints are accessible

#### 3. Image Loading Failures

**Problem**: Generated images don't display

**Solution**:
- Verify image URLs are publicly accessible
- Check CORS configuration for image endpoints
- Ensure proper image formats (PNG, JPG, WebP)

#### 4. Docker Build Issues

**Problem**: Docker build fails

**Solution**:
- Ensure all dependencies are in \`package.json\`
- Check Node.js version compatibility
- Verify \`.dockerignore\` doesn't exclude necessary files

### Debug Mode

Enable debug logging by setting:

\`\`\`env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
\`\`\`

### Getting Help

1. **Check the console** for error messages
2. **Verify environment variables** are loaded correctly
3. **Test with mock mode** to isolate API issues
4. **Check network tab** for failed requests
5. **Review API documentation** for correct request formats

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Install dependencies: \`npm install\`
4. Make your changes
5. Test thoroughly (mock and real API modes)
6. Commit changes: \`git commit -m 'Add amazing feature'\`
7. Push to branch: \`git push origin feature/amazing-feature\`
8. Open a Pull Request

### Code Standards

- **TypeScript**: Use proper types for all functions and components
- **Error Handling**: Implement comprehensive error handling
- **Accessibility**: Follow WCAG guidelines
- **Responsive Design**: Test on multiple screen sizes
- **Documentation**: Update README for new features

### Pull Request Guidelines

- Describe the changes clearly
- Include screenshots for UI changes
- Test with both mock and real APIs
- Update documentation if needed
- Ensure all checks pass

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Roadmap

### Planned Features

- [ ] User authentication and sessions
- [ ] Usage analytics and metrics
- [ ] Batch processing capabilities
- [ ] Real-time streaming responses
- [ ] Model comparison tools
- [ ] Custom model training interface
- [ ] Advanced error recovery
- [ ] Performance monitoring
- [ ] API rate limiting UI
- [ ] Offline mode support

### Technical Improvements

- [ ] WebSocket support for real-time features
- [ ] Progressive Web App (PWA) capabilities
- [ ] Advanced caching strategies
- [ ] Performance optimizations
- [ ] Automated testing suite
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting
- [ ] Security enhancements

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
