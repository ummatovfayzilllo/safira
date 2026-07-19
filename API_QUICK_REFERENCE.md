# API Quick Reference

**Base URL:** `http://localhost:15975/api`  
**Default Port:** 15975  
**Auth:** JWT Token in `Authorization: Bearer <token>` header

---

## All Endpoints Cheat Sheet

### Auth (No Auth Required ⭐)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/verify` | Verify email/account |
| POST | `/auth/login` | Login & get JWT token |

### Users
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/users/create` | Create user (multipart) |
| PATCH | `/users/updateimage/:id` | Update profile image |
| GET | `/users/*` | Get user data |

### Courses
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/courses/create-one` | Create course |
| GET | `/courses/getall` | List all courses |
| GET | `/courses/get-one/:id` | Get course details |
| PATCH | `/courses/update-one/:id` | Update course |
| DELETE | `/courses/delete-one/:id` | Delete course |

### Course Categories
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/course-categories/create-one` | Create category |
| GET | `/course-categories/getall` | List categories |
| GET | `/course-categories/get-one/:id` | Get category |
| PATCH | `/course-categories/update-one/:id` | Update category |
| DELETE | `/course-categories/delete-one/:id` | Delete category |

### Lessons
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/lessons/create-one` | Create lesson |
| GET | `/lessons/getall` | List lessons |
| GET | `/lessons/get-one/:id` | Get lesson |
| PATCH | `/lessons/update-one/:id` | Update lesson |
| DELETE | `/lessons/delete-one/:id` | Delete lesson |
| POST | `/lessons/:id/files` | Upload file |
| GET | `/lessons/:id/files` | Get lesson files |
| DELETE | `/lessons/:id/files/:fileId` | Delete file |
| POST | `/lessons/:id/views` | Mark as viewed |

### Lesson Modules
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/lesson-modules/create-one` | Create module |
| GET | `/lesson-modules/getall` | List modules |
| GET | `/lesson-modules/get-one/:id` | Get module |
| PATCH | `/lesson-modules/update-one/:id` | Update module |
| DELETE | `/lesson-modules/delete-one/:id` | Delete module |

### Homeworks
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/homeworks/create-one` | Create homework |
| GET | `/homeworks/getall` | List homeworks |
| GET | `/homeworks/get-one/:id` | Get homework |
| PATCH | `/homeworks/update-one/:id` | Update homework |
| DELETE | `/homeworks/delete-one/:id` | Delete homework |

### Homework Submissions
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/homework-submissions/create-one` | Submit homework |
| GET | `/homework-submissions/getall` | List submissions |
| GET | `/homework-submissions/get-one/:id` | Get submission |
| PATCH | `/homework-submissions/update-one/:id` | Update submission |
| DELETE | `/homework-submissions/delete-one/:id` | Delete submission |

### Exams
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/exams/create-one` | Create exam |
| GET | `/exams/getall` | List exams |
| GET | `/exams/get-one/:id` | Get exam |
| PATCH | `/exams/update-one/:id` | Update exam |
| DELETE | `/exams/delete-one/:id` | Delete exam |

### Exam Results
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/exam-results/create-one` | Submit exam |
| GET | `/exam-results/getall` | List results |
| GET | `/exam-results/get-one/:id` | Get result |

### Questions (Q&A Forum)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/questions/create-one` | Ask question |
| GET | `/questions/getall` | List questions |
| GET | `/questions/get-one/:id` | Get question |
| PATCH | `/questions/update-one/:id` | Update question |
| DELETE | `/questions/delete-one/:id` | Delete question |

### Question Answers
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/question-answers/create-one` | Answer question |
| GET | `/question-answers/getall` | List answers |
| GET | `/question-answers/get-one/:id` | Get answer |
| PATCH | `/question-answers/update-one/:id` | Update answer |
| DELETE | `/question-answers/delete-one/:id` | Delete answer |

### Mentor Profiles
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/mentor-profiles/create-one` | Create profile |
| GET | `/mentor-profiles/getall` | List mentors |
| GET | `/mentor-profiles/get-one/:id` | Get mentor |
| PATCH | `/mentor-profiles/update-one/:id` | Update mentor |
| DELETE | `/mentor-profiles/delete-one/:id` | Delete mentor |

### Assigned Courses
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/assigned-courses/create-one` | Assign course |
| GET | `/assigned-courses/getall` | List assignments |
| GET | `/assigned-courses/get-one/:id` | Get assignment |
| PATCH | `/assigned-courses/update-one/:id` | Update assignment |
| DELETE | `/assigned-courses/delete-one/:id` | Delete assignment |

### Purchased Courses
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/purchased-courses/create-one` | Record purchase |
| GET | `/purchased-courses/getall` | List purchases |
| GET | `/purchased-courses/get-one/:id` | Get purchase |
| PATCH | `/purchased-courses/update-one/:id` | Update purchase |
| DELETE | `/purchased-courses/delete-one/:id` | Delete purchase |

### Ratings
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/ratings/create-one` | Create review |
| GET | `/ratings/getall` | List ratings |
| GET | `/ratings/get-one/:id` | Get rating |
| PATCH | `/ratings/update-one/:id` | Update rating |
| DELETE | `/ratings/delete-one/:id` | Delete rating |

### Last Activity
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/last-activities/create-one` | Log activity |
| GET | `/last-activities/getall` | List activities |
| GET | `/last-activities/get-one/:id` | Get activity |
| PATCH | `/last-activities/update-one/:id` | Update activity |
| DELETE | `/last-activities/delete-one/:id` | Delete activity |

### Contact
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/contacts/create-one` | Submit contact form |
| GET | `/contacts/getall` | Get submissions |
| GET | `/contacts/get-one/:id` | Get submission |
| DELETE | `/contacts/delete-one/:id` | Delete submission |

### Admin
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/admin/assign-role` | Assign user role |
| POST | `/admin/create-permission` | Create permission |
| PATCH | `/admin/*` | Admin operations |

### File Streaming
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/video/:file` | Stream video |
| GET | `/api/image/:file` | Stream image |
| GET | `/api/archive/:file` | Download archive |
| GET | `/api/docs/:file` | Download docs |

---

## Common Request Headers

```javascript
// All requests (except public auth routes):
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'application/json'
}

// File uploads:
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN',
  'Content-Type': 'multipart/form-data'
}
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

---

## User Roles

- `ADMIN` - Full system access
- `MENTOR` - Can create/manage courses
- `ASSISTANT` - Helper role
- `STUDENT` - Student access

---

## Course Levels

- `BEGINNER`
- `PRE_INTERMEDIATE`
- `INTERMEDIATE`
- `UPPER_INTERMEDIATE`
- `ADVANCED`

---

## Homework Status

- `PENDING` - Submitted, awaiting review
- `APPROVED` - Approved by instructor
- `REJECTED` - Needs revision

---

## Axios Integration Template

```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:15975/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Testing with Swagger UI

Open `http://localhost:15975/api-docs` to:
- View all endpoints
- Test API calls directly
- See request/response examples
- Check parameter requirements

---

**Quick Tip:** Every endpoint follows REST conventions:
- `POST` = Create
- `GET` = Read
- `PATCH` = Update
- `DELETE` = Delete
