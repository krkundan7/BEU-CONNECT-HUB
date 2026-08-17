export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'BEU Connect Hub REST & Real-time API',
    version: '1.0.0',
    description:
      'Official Production-Ready Backend API documentation for Bihar Engineering University (BEU) Student Ecosystem: "One Hub. Every BEU Student."',
    contact: {
      name: 'BEU Connect Hub Engineering Team',
      url: 'https://beu-connect-hub.digital',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Current Environment API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your JWT Access Token (generated from /auth/login or /auth/register)',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new BEU student with academic details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'college', 'branch', 'semester', 'beuRegNo'],
                properties: {
                  name: { type: 'string', example: 'Aman Kumar' },
                  email: { type: 'string', format: 'email', example: 'aman.mit@beu.edu.in' },
                  password: { type: 'string', example: 'Password123' },
                  mobile: { type: 'string', example: '+91 9876543210' },
                  college: { type: 'string', example: 'Muzaffarpur Institute of Technology' },
                  branch: { type: 'string', example: 'Computer Science and Engineering' },
                  semester: { type: 'integer', example: 3 },
                  beuRegNo: { type: 'string', example: '22103108001' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Student registered and JWT tokens issued' },
          409: { description: 'Email or BEU registration number already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'aman.mit@beu.edu.in' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current authenticated user profile',
        responses: {
          200: { description: 'Authenticated user profile' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/posts': {
      get: {
        tags: ['Social Feed'],
        summary: 'Get paginated campus posts',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Paginated campus posts' } },
      },
      post: {
        tags: ['Social Feed'],
        summary: 'Create a new campus post',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', example: 'Our Smart India Hackathon team qualified for the grand finale!' },
                  type: { type: 'string', enum: ['TEXT', 'IMAGE', 'VIDEO', 'EDUCATIONAL', 'PROJECT', 'ACHIEVEMENT'] },
                  visibility: { type: 'string', enum: ['PUBLIC', 'CAMPUS', 'COMMUNITY'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Post created' } },
      },
    },
    '/academic/subjects': {
      get: {
        tags: ['Study Hub'],
        summary: 'List subjects filtered by branch and semester',
        parameters: [
          { name: 'branchId', in: 'query', schema: { type: 'string' } },
          { name: 'semesterId', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of subjects' } },
      },
    },
    '/ai/analyze-pyq': {
      post: {
        tags: ['AI Assistant'],
        summary: 'Analyze recurring exam question patterns for a subject',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['subjectName'],
                properties: {
                  subjectName: { type: 'string', example: 'Data Structures and Algorithms' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Historical PYQ pattern priority analysis with disclaimer' },
        },
      },
    },
    '/ai/chat': {
      post: {
        tags: ['AI Assistant'],
        summary: 'Ask academic questions in English, Hindi, or Hinglish',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  conversationId: { type: 'string', format: 'uuid' },
                  message: { type: 'string', example: 'Explain AVL tree rotations with examples' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'AI academic response' } },
      },
    },
    '/projects': {
      get: {
        tags: ['Projects & Collaboration'],
        summary: 'List active capstone / hackathon projects',
        responses: { 200: { description: 'List of projects' } },
      },
      post: {
        tags: ['Projects & Collaboration'],
        summary: 'Post a new collaborative project for team recruiting',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'category', 'requiredSkills'],
                properties: {
                  title: { type: 'string', example: 'AI Smart Traffic Management for Patna' },
                  description: { type: 'string', example: 'Building OpenCV and FastAPI traffic flow optimizer' },
                  category: { type: 'string', example: 'AI / Embedded Systems' },
                  requiredSkills: { type: 'array', items: { type: 'string' }, example: ['Python', 'OpenCV', 'React'] },
                  teamSize: { type: 'integer', example: 4 },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Project created' } },
      },
    },
    '/projects/{id}/matches': {
      get: {
        tags: ['Projects & Collaboration'],
        summary: 'Find matching BEU students based on complementary skill stack',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'List of ranked student teammate matches' } },
      },
    },
    '/notices': {
      get: {
        tags: ['BEU Information Hub'],
        summary: 'Get verified university circulars, datesheets, and results',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['EXAM', 'RESULT', 'ADMISSION', 'SCHOLARSHIP', 'CAREER', 'GENERAL'] } },
        ],
        responses: { 200: { description: 'List of official notices' } },
      },
    },
    '/admin/dashboard': {
      get: {
        tags: ['Admin Console'],
        summary: 'Get university ecosystem statistics (Admin only)',
        responses: {
          200: { description: 'Dashboard metrics' },
          403: { description: 'Admin permission required' },
        },
      },
    },
  },
};
