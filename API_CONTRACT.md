# BallerPro API Contract Documentation

## Overview

This document provides comprehensive documentation for the BallerPro API, including endpoint specifications, request/response formats, error handling, and integration guidelines.

**Base URL:** `http://localhost:5000`  
**API Version:** `1.0.0`  
**Protocol:** `HTTP/HTTPS`  
**Data Format:** `JSON`  
**Authentication:** `Bearer Token (JWT)`  
**Last Updated:** December 9, 2025

---

## 📋 Table of Contents

1. [API Conventions](#api-conventions)
2. [Authentication APIs](#authentication-apis)
3. [User Profile APIs](#user-profile-apis)
4. [Onboarding APIs](#onboarding-apis)
5. [Health Check](#health-check)
6. [Error Handling](#error-handling)
7. [Frontend-API Mapping](#frontend-api-mapping)
8. [Testing Guide](#testing-guide)

---

## 🔧 API Conventions

### Request Headers

#### For All Requests:
```
Content-Type: application/json
Accept: application/json
```

#### For Protected Endpoints:
```
Authorization: Bearer <access_token>
```

### Response Format

All API responses follow a consistent structure:

#### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional, for validation errors
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 422 | Unprocessable Entity | Semantic validation errors |
| 500 | Internal Server Error | Server-side error |

### Pagination (Future Implementation)

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 🔐 Authentication APIs

### 1. Register User

Creates a new user account and returns authentication tokens.

**Endpoint:** `POST /api/auth/register`  
**Authentication:** Not required  
**Rate Limit:** 5 requests per 15 minutes per IP

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | Valid email format | User's email address |
| `password` | string | Yes | 6-100 characters | Account password |
| `name` | string | No | 1-100 characters | User's display name |

**Example:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

---

#### Success Response (201 Created):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": null,
      "isEmailVerified": false,
      "createdAt": "2025-12-09T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY1YTFiMmMzZDRlNWY2YTdiOGM5ZDAiLCJpYXQiOjE3MDIxMjM0NTYsImV4cCI6MTcwMjEyNDM1Nn0.xxxxx",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGY1YTFiMmMzZDRlNWY2YTdiOGM5ZDAiLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTcwMjEyMzQ1NiwiZXhwIjoxNzA0NzE1NDU2fQ.xxxxx"
  }
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Email Format:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string",
      "validation": "email"
    }
  ]
}
```

**400 Bad Request - Password Too Short:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "String must contain at least 6 character(s)",
      "code": "too_small",
      "minimum": 6
    }
  ]
}
```

**400 Bad Request - Missing Required Field:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**409 Conflict - Email Already Exists:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to create user"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@test.com",
    "password": "test123",
    "name": "Test User"
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/register
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "testuser@test.com",
  "password": "test123",
  "name": "Test User"
}
```

---

### 2. Login User

Authenticates a user and returns authentication tokens.

**Endpoint:** `POST /api/auth/login`  
**Authentication:** Not required  
**Rate Limit:** 10 requests per 15 minutes per IP

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | Valid email format | User's registered email |
| `password` | string | Yes | - | User's password |

**Example:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": null,
      "isEmailVerified": false,
      "onboardingCompleted": true,
      "createdAt": "2025-12-09T10:00:00.000Z",
      "updatedAt": "2025-12-09T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Email Format:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string",
      "validation": "email"
    }
  ]
}
```

**400 Bad Request - Missing Credentials:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**401 Unauthorized - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Login failed. Please try again."
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@test.com",
    "password": "test123"
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "testuser@test.com",
  "password": "test123"
}
```

---

#### Notes:

- Access tokens expire in **15 minutes**
- Refresh tokens expire in **30 days**
- Store tokens securely (use secure storage on mobile)
- Use refresh token to obtain new access tokens without re-login

---

### 3. Get Current User

Retrieves the authenticated user's information.

**Endpoint:** `GET /api/auth/me`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 60 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": null,
      "isEmailVerified": false,
      "onboardingCompleted": true,
      "createdAt": "2025-12-09T10:00:00.000Z",
      "updatedAt": "2025-12-09T10:00:00.000Z"
    }
  }
}
```

---

#### Error Responses:

**401 Unauthorized - No Token Provided:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**401 Unauthorized - Token Expired:**
```json
{
  "success": false,
  "message": "Token has expired"
}
```

**404 Not Found - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch user data"
}
```

---

#### cURL Example:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Thunder Client Test:

```
Method: GET
URL: http://localhost:5000/api/auth/me
Headers:
  Authorization: Bearer <paste_token_here>
```

---

#### Notes:

- This endpoint is useful for verifying token validity
- Use this to restore user session on app launch
- If this returns 401, redirect user to login screen

---

### 4. Refresh Token

Generates new access and refresh tokens using a valid refresh token.

**Endpoint:** `POST /api/auth/refresh-token`  
**Authentication:** Not required  
**Rate Limit:** 20 requests per hour

---

#### Request Body:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | Yes | Valid refresh token from login/register |

**Example:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newAccessToken...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newRefreshToken..."
  }
}
```

---

#### Error Responses:

**400 Bad Request - Missing Refresh Token:**
```json
{
  "success": false,
  "message": "Refresh token is required"
}
```

**401 Unauthorized - Invalid Refresh Token:**
```json
{
  "success": false,
  "message": "Invalid refresh token"
}
```

**401 Unauthorized - Expired Refresh Token:**
```json
{
  "success": false,
  "message": "Refresh token has expired"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to refresh token"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/refresh-token
Headers:
  Content-Type: application/json
Body (JSON):
{
  "refreshToken": "<paste_refresh_token_here>"
}
```

---

#### Notes:

- Both tokens are rotated on refresh for security
- Old refresh token becomes invalid after use
- Implement automatic token refresh on 401 responses in your API client

---

### 5. Logout User

Logs out the current user and invalidates their session.

**Endpoint:** `POST /api/auth/logout`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### Error Responses:

**401 Unauthorized - No Token:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Logout failed"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/logout
Headers:
  Authorization: Bearer <paste_token_here>
```

---

#### Notes:

- Clear all tokens from client storage after successful logout
- Redirect user to login screen
- This endpoint is idempotent (safe to call multiple times)

---

### 6. Forgot Password

Initiates password reset process by sending a reset link to the user's email.

**Endpoint:** `POST /api/auth/forgot-password`  
**Authentication:** Not required  
**Rate Limit:** 3 requests per hour per email  
**Status:** ⚠️ Placeholder (Email not sent yet)

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `email` | string | Yes | Valid email format | Registered email address |

**Example:**
```json
{
  "email": "john@example.com"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent"
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Email:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string"
    }
  ]
}
```

**429 Too Many Requests:**
```json
{
  "success": false,
  "message": "Too many password reset attempts. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to process password reset request"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@test.com"
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/forgot-password
Headers:
  Content-Type: application/json
Body (JSON):
{
  "email": "testuser@test.com"
}
```

---

#### Notes:

- Response is intentionally vague to prevent email enumeration
- Reset token expires in 1 hour
- **TODO:** Implement email service integration

---

### 7. Reset Password

Resets user password using a valid reset token.

**Endpoint:** `POST /api/auth/reset-password`  
**Authentication:** Not required  
**Status:** ⚠️ Placeholder (Not fully implemented)

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `token` | string | Yes | - | Reset token from email |
| `password` | string | Yes | 6-100 characters | New password |

**Example:**
```json
{
  "token": "a1b2c3d4e5f6g7h8i9j0",
  "password": "newSecurePassword123"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Password reset functionality will be implemented soon"
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**400 Bad Request - Weak Password:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "String must contain at least 6 character(s)",
      "code": "too_small"
    }
  ]
}
```

**404 Not Found - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to reset password"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "a1b2c3d4e5f6g7h8i9j0",
    "password": "newpass123"
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/auth/reset-password
Headers:
  Content-Type: application/json
Body (JSON):
{
  "token": "some_token",
  "password": "newpass123"
}
```

---

#### Notes:

- Reset tokens are single-use only
- Tokens expire after 1 hour
- All user sessions are invalidated after password reset
- **TODO:** Complete implementation

---

## 👤 User Profile APIs

### 8. Get User Profile

Retrieves the authenticated user's complete profile including onboarding data.

**Endpoint:** `GET /api/users/profile`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 60 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Doe",
      "avatar": "https://example.com/uploads/avatars/user123.jpg",
      "isEmailVerified": false,
      "onboarding": {
        "step1": {
          "gender": "male"
        },
        "step2": {
          "experienceLevel": "intermediate"
        },
        "step3": {
          "injuries": ["knee"],
          "otherDetails": "Old sports injury"
        },
        "step4": {
          "goal": "muscle-gain"
        },
        "completed": true,
        "completedAt": "2025-12-09T10:30:00.000Z"
      },
      "createdAt": "2025-12-09T10:00:00.000Z",
      "updatedAt": "2025-12-09T10:30:00.000Z"
    }
  }
}
```

---

#### Error Responses:

**401 Unauthorized - No Token:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch profile"
}
```

---

#### cURL Example:

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Thunder Client Test:

```
Method: GET
URL: http://localhost:5000/api/users/profile
Headers:
  Authorization: Bearer <paste_token_here>
```

---

#### Notes:

- Returns complete user profile including onboarding status
- Use this to check if user completed onboarding
- Avatar URL will be null if user hasn't uploaded one

---

### 9. Update User Profile

Updates the authenticated user's profile information.

**Endpoint:** `PUT /api/users/profile`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `name` | string | No | 1-100 characters | User's display name |
| `avatar` | string | No | Valid URL | Profile picture URL |

**Example:**
```json
{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "email": "john@example.com",
      "name": "John Updated",
      "avatar": "https://example.com/avatar.jpg",
      "isEmailVerified": false,
      "onboarding": {
        "step1": { "gender": "male" },
        "step2": { "goal": "muscle", "trainingLevel": "strength_athlete" },
        "step3": { "experienceLevel": "intermediate" },
        "step4": { "injuries": ["knee"], "otherDetails": "Old sports injury" },
        "step5": { "goal": "muscle-gain" },
        "completed": true,
        "completedAt": "2025-12-09T10:30:00.000Z"
      },
      "createdAt": "2025-12-09T10:00:00.000Z",
      "updatedAt": "2025-12-09T11:00:00.000Z"
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Name Length:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "String must contain at most 100 character(s)",
      "code": "too_big"
    }
  ]
}
```

**400 Bad Request - Invalid Avatar URL:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "avatar",
      "message": "Invalid url",
      "code": "invalid_string"
    }
  ]
}
```

**401 Unauthorized - No Token:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to update profile"
}
```

---

#### cURL Example:

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

---

#### Thunder Client Test:

```
Method: PUT
URL: http://localhost:5000/api/users/profile
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "name": "Updated Name"
}
```

---

#### Notes:

- Both fields are optional (partial updates supported)
- Empty string values are not allowed
- Avatar should be a publicly accessible URL
- **TODO:** Implement direct image upload endpoint

---

## 🎯 Onboarding APIs

### 10. Save Onboarding Step 1 (About)

Saves the first step of user onboarding (gender selection).

**Endpoint:** `POST /api/onboarding/step1`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Allowed Values | Description |
|-------|------|----------|----------------|-------------|
| `gender` | string | Yes | `male`, `female`, `other` | User's gender |

**Example:**
```json
{
  "gender": "male"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Step 1 saved successfully",
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "completed": false
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Missing Field:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "gender",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**400 Bad Request - Invalid Gender Value:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "gender",
      "message": "Invalid enum value. Expected 'male' | 'female' | 'other', received 'invalid'",
      "code": "invalid_enum_value",
      "options": ["male", "female", "other"]
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to save onboarding step"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/onboarding/step1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"gender": "male"}'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/onboarding/step1
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "gender": "male"
}
```

---

### 11. Save Onboarding Step 2 (Journey / About / Main Goal)

Saves the second step of user onboarding (main goal and training level selection).

**Endpoint:** `POST /api/onboarding/step2`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Allowed Values | Description |
|-------|------|----------|----------------|-------------|
| `goal` | string | Yes | `muscle`, `fat_loss`, `endurance`, `strength` | User's main fitness goal |
| `trainingLevel` | string | Yes | `strength_athlete`, `endurance_runner`, `casual`, `beginner` | User's self-identified training level |

**Example:**
```json
{
  "goal": "muscle",
  "trainingLevel": "strength_athlete"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Step 2 saved successfully",
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "goal": "muscle",
        "trainingLevel": "strength_athlete"
      },
      "completed": false
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Missing Field:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "goal",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**400 Bad Request - Invalid Goal Value:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "goal",
      "message": "Invalid enum value. Expected 'muscle' | 'fat_loss' | 'endurance' | 'strength'",
      "code": "invalid_enum_value",
      "options": ["muscle", "fat_loss", "endurance", "strength"]
    }
  ]
}
```

**400 Bad Request - Invalid Training Level:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "trainingLevel",
      "message": "Invalid enum value. Expected 'strength_athlete' | 'endurance_runner' | 'casual' | 'beginner'",
      "code": "invalid_enum_value",
      "options": ["strength_athlete", "endurance_runner", "casual", "beginner"]
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to save step 2"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/onboarding/step2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"goal": "muscle", "trainingLevel": "strength_athlete"}'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/onboarding/step2
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "goal": "muscle",
  "trainingLevel": "strength_athlete"
}
```

---

#### Notes:

- Both fields are required
- Used to personalize workout recommendations and program selection
- Includes data from previous steps in the response for client convenience

---

### 12. Save Onboarding Step 3 (Training Experience)

Saves the third step of user onboarding (training experience level).

**Endpoint:** `POST /api/onboarding/step3`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Allowed Values | Description |
|-------|------|----------|----------------|-------------|
| `experienceLevel` | string | Yes | `beginner`, `intermediate`, `advanced` | User's fitness experience level |

**Example:**
```json
{
  "experienceLevel": "intermediate"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Step 3 saved successfully",
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "goal": "muscle",
        "trainingLevel": "strength_athlete"
      },
      "step3": {
        "experienceLevel": "intermediate"
      },
      "completed": false
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Missing Field:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "experienceLevel",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**400 Bad Request - Invalid Experience Level:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "experienceLevel",
      "message": "Invalid enum value. Expected 'beginner' | 'intermediate' | 'advanced'",
      "code": "invalid_enum_value",
      "options": ["beginner", "intermediate", "advanced"]
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to save step 3"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/onboarding/step3 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"experienceLevel": "intermediate"}'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/onboarding/step3
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "experienceLevel": "intermediate"
}
```

---

#### Notes:

- Used to personalize workout difficulty and program recommendations
- Includes data from previous steps in the response for client convenience

---

### 13. Save Onboarding Step 4 (Injuries)

Saves the fourth step of user onboarding (injury history and additional details).

**Endpoint:** `POST /api/onboarding/step4`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `injuries` | array | No | Array of strings | List of current/past injuries |
| `otherDetails` | string | No | - | Additional injury or health details |

**Example:**
```json
{
  "injuries": ["knee", "shoulder"],
  "otherDetails": "Had knee surgery 2 years ago"
}
```

**Minimal Example (all fields optional):**
```json
{
  "injuries": [],
  "otherDetails": ""
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Step 4 saved successfully",
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "goal": "muscle",
        "trainingLevel": "strength_athlete"
      },
      "step3": {
        "experienceLevel": "intermediate"
      },
      "step4": {
        "injuries": ["knee", "shoulder"],
        "otherDetails": "Had knee surgery 2 years ago"
      },
      "completed": false
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Invalid Data Type:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "injuries",
      "message": "Expected array, received string",
      "code": "invalid_type"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to save step 4"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/onboarding/step4 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "injuries": ["knee"],
    "otherDetails": "Old injury"
  }'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/onboarding/step4
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "injuries": ["knee"],
  "otherDetails": "Old injury"
}
```

---

#### Notes:

- Both fields are optional
- Empty arrays and strings are valid values
- Used to personalize workout recommendations

---

### 14. Save Onboarding Step 5 (Main Goal) & Complete Onboarding

Saves the final step of user onboarding (main fitness goal) and marks onboarding as complete.

**Endpoint:** `POST /api/onboarding/step5`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 30 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

#### Request Body:

| Field | Type | Required | Allowed Values | Description |
|-------|------|----------|----------------|-------------|
| `goal` | string | Yes | `muscle-gain`, `fat-loss`, `maintenance` | User's primary fitness goal |

**Example:**
```json
{
  "goal": "muscle-gain"
}
```

---

#### Success Response (200 OK):

```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "goal": "muscle",
        "trainingLevel": "strength_athlete"
      },
      "step3": {
        "experienceLevel": "intermediate"
      },
      "step4": {
        "injuries": ["knee"],
        "otherDetails": "Old sports injury"
      },
      "step5": {
        "goal": "muscle-gain"
      },
      "completed": true,
      "completedAt": "2025-12-09T10:30:00.000Z"
    }
  }
}
```

---

#### Error Responses:

**400 Bad Request - Missing Field:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "goal",
      "message": "Required",
      "code": "invalid_type"
    }
  ]
}
```

**400 Bad Request - Invalid Goal Value:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "goal",
      "message": "Invalid enum value. Expected 'muscle-gain' | 'fat-loss' | 'maintenance'",
      "code": "invalid_enum_value",
      "options": ["muscle-gain", "fat-loss", "maintenance"]
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to save step 5"
}
```

---

#### cURL Example:

```bash
curl -X POST http://localhost:5000/api/onboarding/step5 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"goal": "muscle-gain"}'
```

---

#### Thunder Client Test:

```
Method: POST
URL: http://localhost:5000/api/onboarding/step5
Headers:
  Authorization: Bearer <paste_token_here>
  Content-Type: application/json
Body (JSON):
{
  "goal": "muscle-gain"
}
```

---

#### Notes:

- This endpoint marks `onboarding.completed` as `true`
- Sets `completedAt` timestamp automatically
- After this, user can access the main app
- Frontend should redirect to home dashboard after completion

---

### 14. Get Onboarding Status

Retrieves the user's onboarding completion status and all saved data.

**Endpoint:** `GET /api/onboarding/status`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** 60 requests per minute

---

#### Request Headers:

```
Authorization: Bearer <access_token>
```

---

#### Success Response (200 OK):

**When Onboarding is Complete:**
```json
{
  "success": true,
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "experienceLevel": "intermediate"
      },
      "step3": {
        "injuries": ["knee"],
        "otherDetails": "Old sports injury"
      },
      "step4": {
        "goal": "muscle-gain"
      },
      "completed": true,
      "completedAt": "2025-12-09T10:30:00.000Z"
    }
  }
}
```

**When Onboarding is Incomplete:**
```json
{
  "success": true,
  "data": {
    "onboarding": {
      "step1": {
        "gender": "male"
      },
      "step2": {
        "experienceLevel": "intermediate"
      },
      "completed": false
    }
  }
}
```

**When Onboarding Not Started:**
```json
{
  "success": true,
  "data": {
    "onboarding": {
      "completed": false
    }
  }
}
```

---

#### Error Responses:

**401 Unauthorized - No Token:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**401 Unauthorized - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Failed to fetch onboarding status"
}
```

---

#### cURL Example:

```bash
curl -X GET http://localhost:5000/api/onboarding/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

#### Thunder Client Test:

```
Method: GET
URL: http://localhost:5000/api/onboarding/status
Headers:
  Authorization: Bearer <paste_token_here>
```

---

#### Notes:

- Use this on app launch to determine user's onboarding state
- Check `completed` field to decide navigation flow
- Returns only completed steps (no null/undefined for incomplete steps)
- Frontend should resume from the first incomplete step

---

## 🏥 Health Check

### 15. Health Check

Verifies that the API server is running and operational.

**Endpoint:** `GET /health`  
**Authentication:** Not required  
**Rate Limit:** None

---

#### Success Response (200 OK):

```json
{
  "ok": true,
  "service": "ballerpro-api",
  "timestamp": "2025-12-09T10:00:00.000Z",
  "uptime": 3600
}
```

---

#### Response Fields:

| Field | Type | Description |
|-------|------|-------------|
| `ok` | boolean | Always `true` if server is running |
| `service` | string | Service identifier |
| `timestamp` | string | Current server timestamp (ISO 8601) |
| `uptime` | number | Server uptime in seconds |

---

#### Error Responses:

**If this endpoint doesn't respond, the server is down or unreachable.**

---

#### cURL Example:

```bash
curl -X GET http://localhost:5000/health
```

---

#### Thunder Client Test:

```
Method: GET
URL: http://localhost:5000/health
```

---

#### Notes:

- Use this for monitoring and load balancer health checks
- No authentication required
- Lightweight endpoint with minimal database queries
- Should always return 200 if server is operational

---

## 🗺️ Frontend-API Mapping

### Current Frontend Screens → API Endpoints Needed

#### **Authentication Screens**
- **`/auth/login`** → `POST /api/auth/login`
- **`/auth/register`** → `POST /api/auth/register`

#### **Onboarding Screens**
- **`/onboarding/about`** → `POST /api/onboarding/step1` (Gender)
- **`/onboarding/journey`** → `POST /api/onboarding/step2` (Goal & Training Level)
- **`/onboarding/trainingExperience`** → `POST /api/onboarding/step3` (Experience Level)
- **`/onboarding/injuries`** → `POST /api/onboarding/step4` (Injuries)
- **`/onboarding/mainGoal`** → `POST /api/onboarding/step5` (Main Goal - Completes Onboarding)

#### **Main App Screens**
- **`/(tabs)/index`** (Home Dashboard) → 
  - `GET /api/auth/me`
  - `GET /api/tracking/stats` *(To be implemented)*
  - `GET /api/workouts/recommended` *(To be implemented)*

- **`/(tabs)/train`** (Workout List) →
  - `GET /api/workouts` *(To be implemented)*
  - `GET /api/exercises/search` *(To be implemented)*

- **`/workouts/[id]`** (Workout Detail) →
  - `GET /api/workouts/:id` *(To be implemented)*
  - `POST /api/workouts/sessions` *(To be implemented)*

- **`/(tabs)/track`** (Progress Tracking) →
  - `GET /api/tracking/history` *(To be implemented)*
  - `GET /api/tracking/progress` *(To be implemented)*
  - `POST /api/tracking/measurements` *(To be implemented)*

- **`/(tabs)/community`** (Community Feed) →
  - `GET /api/community/posts` *(To be implemented)*
  - `POST /api/community/posts` *(To be implemented)*

- **`/(tabs)/shop`** (Shop) →
  - `GET /api/shop/products` *(To be implemented)*
  - `GET /api/shop/cart` *(To be implemented)*

- **`/(tabs)/settings`** (Settings) →
  - `GET /api/users/profile`
  - `PUT /api/users/profile`
  - `POST /api/auth/logout`

---

## ⚠️ Error Handling

### Error Response Structure

All API errors follow a consistent structure for easier debugging and handling.

#### Standard Error Format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [],
  "error": "Detailed error (development mode only)"
}
```

---

### HTTP Status Codes

| Code | Status | Description | When Used |
|------|--------|-------------|-----------|
| 200 | OK | Success | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Resource created | Successful POST (new resource) |
| 400 | Bad Request | Client error | Validation errors, malformed JSON |
| 401 | Unauthorized | Authentication failed | Missing/invalid token, wrong credentials |
| 403 | Forbidden | Access denied | Valid auth but insufficient permissions |
| 404 | Not Found | Resource not found | User, workout, or resource doesn't exist |
| 409 | Conflict | Resource conflict | Duplicate email, concurrent updates |
| 422 | Unprocessable Entity | Semantic error | Valid syntax but business logic violation |
| 429 | Too Many Requests | Rate limit exceeded | Too many requests in time window |
| 500 | Internal Server Error | Server error | Unexpected server-side errors |
| 503 | Service Unavailable | Service down | Database down, maintenance mode |

---

### Error Response Examples

#### 400 Bad Request - Validation Error (Single Field):

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string",
      "validation": "email"
    }
  ]
}
```

#### 400 Bad Request - Validation Error (Multiple Fields):

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email",
      "code": "invalid_string"
    },
    {
      "field": "password",
      "message": "String must contain at least 6 character(s)",
      "code": "too_small",
      "minimum": 6
    }
  ]
}
```

#### 400 Bad Request - Malformed JSON:

```json
{
  "success": false,
  "message": "Invalid JSON in request body"
}
```

#### 401 Unauthorized - No Token:

```json
{
  "success": false,
  "message": "No token provided"
}
```

#### 401 Unauthorized - Invalid Token:

```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### 401 Unauthorized - Invalid Credentials:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 403 Forbidden:

```json
{
  "success": false,
  "message": "You don't have permission to access this resource"
}
```

#### 404 Not Found - User:

```json
{
  "success": false,
  "message": "User not found"
}
```

#### 404 Not Found - Resource:

```json
{
  "success": false,
  "message": "Workout not found"
}
```

#### 409 Conflict - Duplicate Email:

```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### 422 Unprocessable Entity:

```json
{
  "success": false,
  "message": "Cannot delete active workout session"
}
```

#### 429 Too Many Requests:

```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 60
}
```

#### 500 Internal Server Error (Production):

```json
{
  "success": false,
  "message": "An unexpected error occurred. Please try again later."
}
```

#### 500 Internal Server Error (Development):

```json
{
  "success": false,
  "message": "Failed to process request",
  "error": "MongoError: Unable to connect to database at localhost:27017"
}
```

#### 503 Service Unavailable:

```json
{
  "success": false,
  "message": "Service temporarily unavailable. Please try again later."
}
```

---

### Validation Error Codes

Common validation error codes from Zod schema validation:

| Code | Description | Example |
|------|-------------|---------|
| `invalid_type` | Field type mismatch | Expected string, received number |
| `invalid_string` | String validation failed | Invalid email, URL format |
| `too_small` | Value below minimum | Password less than 6 characters |
| `too_big` | Value above maximum | Name exceeds 100 characters |
| `invalid_enum_value` | Invalid enum option | Gender not in [male, female, other] |
| `custom` | Custom validation failed | Business rule violation |

---

### Client-Side Error Handling Best Practices

#### 1. Handle Network Errors:

```typescript
try {
  const response = await api.post('/auth/login', credentials);
} catch (error) {
  if (error.response) {
    // Server responded with error
    const { message, errors } = error.response.data;
    showError(message);
  } else if (error.request) {
    // Network error
    showError('Network error. Please check your connection.');
  } else {
    // Other errors
    showError('An unexpected error occurred.');
  }
}
```

#### 2. Display Validation Errors:

```typescript
if (error.response?.status === 400 && error.response.data.errors) {
  error.response.data.errors.forEach(err => {
    setFieldError(err.field, err.message);
  });
}
```

#### 3. Handle Authentication Errors:

```typescript
if (error.response?.status === 401) {
  // Try to refresh token
  await refreshToken();
  // Retry request or redirect to login
}
```

#### 4. Implement Retry Logic:

```typescript
if (error.response?.status === 429) {
  const retryAfter = error.response.data.retryAfter || 60;
  setTimeout(() => retryRequest(), retryAfter * 1000);
}
```

---

### Rate Limiting

Rate limits are applied per endpoint to prevent abuse:

| Endpoint Type | Rate Limit |
|---------------|------------|
| Authentication (Login/Register) | 10 requests per 15 minutes |
| Password Reset | 3 requests per hour |
| Token Refresh | 20 requests per hour |
| Protected Endpoints (GET) | 60 requests per minute |
| Protected Endpoints (POST/PUT) | 30 requests per minute |
| Health Check | Unlimited |

**Rate Limit Headers** (future implementation):
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1702123456
```

---

## 🧪 Testing Guide

### Prerequisites

Before testing, ensure the following are running:

1. **MongoDB** - `mongodb://localhost:27017/ballerpro`
2. **Backend Server** - `http://localhost:5000`
3. **Thunder Client** - Installed in VS Code

---

### Testing Workflow

#### Phase 1: Service Health

1. **Health Check** ✅  
   `GET /health`  
   **Expected:** Status 200, service operational

---

#### Phase 2: User Registration & Authentication

2. **Register New User** ✅  
   `POST /api/auth/register`  
   **Save:** `token`, `refreshToken`, `user.id`  
   **Expected:** Status 201, tokens returned

3. **Login Existing User** ✅  
   `POST /api/auth/login`  
   **Save:** `token`, `refreshToken`  
   **Expected:** Status 200, tokens returned

4. **Get Current User** 🔐  
   `GET /api/auth/me`  
   **Use:** Saved `token`  
   **Expected:** Status 200, user data returned

---

#### Phase 3: Onboarding Flow

5. **Save Step 1 (Gender)** 🔐  
   `POST /api/onboarding/step1`  
   **Body:** `{ "gender": "male" }`  
   **Expected:** Status 200, step1 saved

6. **Save Step 2 (Journey - Goal & Training Level)** 🔐  
   `POST /api/onboarding/step2`  
   **Body:** `{ "goal": "muscle", "trainingLevel": "strength_athlete" }`  
   **Expected:** Status 200, step2 saved

7. **Save Step 3 (Training Experience)** 🔐  
   `POST /api/onboarding/step3`  
   **Body:** `{ "experienceLevel": "intermediate" }`  
   **Expected:** Status 200, step3 saved

8. **Save Step 4 (Injuries)** 🔐  
   `POST /api/onboarding/step4`  
   **Body:** `{ "injuries": ["knee"], "otherDetails": "" }`  
   **Expected:** Status 200, step4 saved

9. **Save Step 5 (Main Goal) & Complete** 🔐  
   `POST /api/onboarding/step5`  
   **Body:** `{ "goal": "muscle-gain" }`  
   **Expected:** Status 200, `completed: true`, `completedAt` timestamp

10. **Check Onboarding Status** 🔐  
   `GET /api/onboarding/status`  
   **Expected:** Status 200, all steps visible, `completed: true`

---

#### Phase 4: Profile Management

10. **Get Full Profile** 🔐  
    `GET /api/users/profile`  
    **Expected:** Status 200, complete profile with onboarding data

11. **Update Profile** 🔐  
    `PUT /api/users/profile`  
    **Body:** `{ "name": "Updated Name" }`  
    **Expected:** Status 200, profile updated, `updatedAt` changed

---

#### Phase 5: Token Management

12. **Refresh Tokens** ✅  
    `POST /api/auth/refresh-token`  
    **Body:** `{ "refreshToken": "<saved_refreshToken>" }`  
    **Expected:** Status 200, new tokens returned

13. **Logout** 🔐  
    `POST /api/auth/logout`  
    **Expected:** Status 200, session invalidated

---

### Testing Validation & Error Handling

#### Test Invalid Inputs:

- **Invalid Email:** Register with `test@invalid`
- **Short Password:** Register with `12345`
- **Wrong Credentials:** Login with incorrect password
- **Invalid Enum:** Step 1 with `"gender": "invalid"`
- **Missing Required Field:** Step 2 without `experienceLevel`

#### Test Authentication Errors:

- **No Token:** Call protected endpoint without `Authorization` header
- **Invalid Token:** Use malformed token
- **Expired Token:** Use token after expiration (15 minutes)

#### Test Edge Cases:

- **Duplicate Email:** Register same email twice
- **Empty Fields:** Submit empty strings where not allowed
- **Large Payloads:** Submit very long strings

---

### Thunder Client Environment Setup

**Create Environment Variables:**

1. Click Thunder Client → Env tab
2. Select "Local"
3. Add variables:

```json
{
  "baseUrl": "http://localhost:5000",
  "token": "",
  "refreshToken": "",
  "userId": ""
}
```

4. Use in requests: `{{baseUrl}}/api/auth/login`

**Auto-save Tokens (Test Script):**

In Thunder Client request → Tests tab:

```javascript
// After successful login/register
if (tc.response.status === 200 || tc.response.status === 201) {
  const data = tc.response.json.data;
  if (data.token) {
    tc.setVar("token", data.token);
  }
  if (data.refreshToken) {
    tc.setVar("refreshToken", data.refreshToken);
  }
  if (data.user?.id) {
    tc.setVar("userId", data.user.id);
  }
}
```

---

### Import Thunder Client Collection

**Option 1: Import JSON Collection**

1. Open Thunder Client
2. Click "Collections" → "..." → "Import"
3. Select `thunder-client-collection.json`
4. All requests pre-configured

**Option 2: Manual Setup**

Use the cURL examples provided in each endpoint section.

---

### Testing Checklist

#### ✅ **Authentication & Authorization**
- [ ] Can register new user
- [ ] Cannot register duplicate email
- [ ] Can login with valid credentials
- [ ] Cannot login with wrong password
- [ ] Can access protected routes with token
- [ ] Cannot access without token
- [ ] Can refresh expired token
- [ ] Can logout successfully

#### ✅ **Onboarding Flow**
- [ ] Can save all 4 steps sequentially
- [ ] Step 4 marks onboarding complete
- [ ] Can retrieve onboarding status
- [ ] Validation rejects invalid enum values
- [ ] Optional fields work correctly

#### ✅ **Profile Management**
- [ ] Can retrieve full profile
- [ ] Can update name
- [ ] Can update avatar URL
- [ ] Validation rejects invalid URLs
- [ ] `updatedAt` timestamp updates

#### ✅ **Error Handling**
- [ ] Validation errors return 400
- [ ] Missing auth returns 401
- [ ] Invalid token returns 401
- [ ] Not found returns 404
- [ ] Duplicate resource returns 409
- [ ] Server errors return 500

---

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Connection refused | Backend not running | Run `cd backend && npm run dev` |
| MongoDB connection error | MongoDB not running | Start MongoDB service |
| 401 Unauthorized | Token expired/missing | Get new token from login |
| 400 Validation error | Invalid request body | Check request format |
| CORS error | Frontend origin not allowed | Check backend CORS config |

---

### Performance Testing (Future)

- **Load Testing:** Apache JMeter, k6
- **Stress Testing:** Test rate limits
- **Concurrency:** Multiple simultaneous requests
- **Response Time:** Monitor p95, p99 latencies

---

## 📝 Technical Notes

### Security

- **Password Hashing:** bcrypt with 12 salt rounds
- **Token Security:** JWT with HS256 algorithm
- **Token Storage:** Store securely (Keychain/Keystore on mobile)
- **HTTPS:** Required in production
- **Rate Limiting:** Prevents brute force attacks

### Database

- **MongoDB Version:** 5.0+
- **Connection Pool:** Default (auto-managed by Mongoose)
- **Indexes:** Required on `email` field for performance
- **Transactions:** Not currently used (future enhancement)

### Environment Configuration

Required environment variables (`.env`):

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ballerpro
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:19006
```

### API Versioning (Future)

Currently: `/api/auth/register`  
Future: `/api/v1/auth/register`

### Deprecation Policy

- 6 months notice before deprecation
- Backward compatibility for 2 major versions
- Clear migration guides provided

---

## 🔜 Future Endpoints (Not Yet Implemented)

The following endpoints are planned for future implementation:

### 💪 Workouts & Exercises (Phase 2)

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/workouts` | GET | List all workouts with filters | High |
| `/api/workouts/:id` | GET | Get workout details | High |
| `/api/workouts` | POST | Create custom workout | Medium |
| `/api/workouts/:id` | PUT | Update workout | Medium |
| `/api/workouts/:id` | DELETE | Delete workout | Low |
| `/api/exercises` | GET | List all exercises | High |
| `/api/exercises/:id` | GET | Get exercise details | High |
| `/api/exercises/search` | GET | Search exercises | Medium |

### 📊 Workout Sessions & Tracking (Phase 3)

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/workouts/sessions` | POST | Start workout session | High |
| `/api/workouts/sessions/:id` | GET | Get session details | High |
| `/api/workouts/sessions/:id` | PUT | Update session progress | High |
| `/api/workouts/sessions/:id/complete` | POST | Complete session | High |
| `/api/tracking/stats` | GET | Get user statistics | High |
| `/api/tracking/history` | GET | Get workout history | High |
| `/api/tracking/measurements` | POST | Log body measurements | Medium |
| `/api/tracking/measurements` | GET | Get measurement history | Medium |
| `/api/tracking/photos` | POST | Upload progress photo | Low |
| `/api/tracking/photos` | GET | Get progress photos | Low |

### 👥 Community (Phase 4)

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/community/posts` | GET | Get community feed | Medium |
| `/api/community/posts` | POST | Create post | Medium |
| `/api/community/posts/:id` | GET | Get post details | Medium |
| `/api/community/posts/:id/like` | POST | Like/unlike post | Low |
| `/api/community/posts/:id/comment` | POST | Add comment | Low |
| `/api/community/users/:id` | GET | Get public profile | Medium |
| `/api/community/follow/:userId` | POST | Follow user | Low |
| `/api/community/follow/:userId` | DELETE | Unfollow user | Low |

### 🛒 Shop & E-commerce (Phase 5)

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/shop/products` | GET | List products | Medium |
| `/api/shop/products/:id` | GET | Get product details | Medium |
| `/api/shop/cart` | GET | Get cart items | Medium |
| `/api/shop/cart` | POST | Add to cart | Medium |
| `/api/shop/cart/:itemId` | DELETE | Remove from cart | Medium |
| `/api/shop/checkout` | POST | Process checkout | Low |
| `/api/shop/orders` | GET | Get order history | Low |

### 📱 Additional Features

| Endpoint | Method | Description | Priority |
|----------|--------|-------------|----------|
| `/api/notifications` | GET | Get user notifications | Medium |
| `/api/notifications/:id/read` | PUT | Mark as read | Medium |
| `/api/feedback` | POST | Submit user feedback | Low |
| `/api/config` | GET | Get app configuration | Low |

---

## 📞 Support & Contact

### For Backend Issues:
- **Email:** backend@ballerpro.com
- **Slack:** #backend-support
- **Issue Tracker:** GitHub Issues

### For API Questions:
- **Documentation:** https://docs.ballerpro.com
- **Changelog:** `CHANGELOG.md`
- **Status Page:** https://status.ballerpro.com

---

## 📄 Document Information

**Document Version:** 2.0.0  
**Last Updated:** December 9, 2025  
**Author:** BallerPro Development Team  
**Maintained By:** Backend Team

**Backend Information:**
- **Version:** 1.0.0
- **Language:** JavaScript (ES6 Modules)
- **Framework:** Express.js 4.18+
- **Database:** MongoDB 5.0+
- **Validation:** Zod
- **Authentication:** JWT

**Frontend Information:**
- **Version:** 1.0.0
- **Framework:** React Native (Expo SDK 52)
- **State Management:** React Context API
- **API Client:** Axios

---

## 📜 Change Log

### Version 2.0.0 (2025-12-09)
- ✅ Complete API documentation rewrite
- ✅ Added comprehensive error responses for all endpoints
- ✅ Added cURL examples for all endpoints
- ✅ Added professional formatting and structure
- ✅ Added detailed testing guide
- ✅ Added client-side error handling examples
- ✅ Added rate limiting documentation
- ✅ Added validation error codes reference

### Version 1.0.0 (2025-12-08)
- ✅ Initial API contract
- ✅ Authentication endpoints implemented
- ✅ User profile endpoints implemented
- ✅ Onboarding endpoints implemented
- ✅ Health check endpoint implemented

---

## ⚖️ License

**Proprietary and Confidential**

This API documentation is proprietary to BallerPro. Unauthorized copying, distribution, or use of this API is strictly prohibited.

© 2025 BallerPro. All rights reserved.

---

**End of Document**

