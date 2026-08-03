# API Endpoint Documentation

## Next.js App Router API Handlers

### 1. `GET /api/portal`
- **File**: `src/app/api/portal/route.ts`
- **Description**: Returns system status, active version, total corporate services, and platform workforce metrics.

### 2. `GET /api/employees`
- **File**: `src/app/api/employees/route.ts`
- **Description**: Returns JSON array of workforce employees, roles, departments, and status flags.

### 3. `POST /api/contact`
- **File**: `src/app/api/contact/route.ts`
- **Description**: Receives proposal requests from Corporate Portal contact form.
- **Request Payload**:
```json
{
  "name": "Rajesh Bhatti",
  "email": "rajesh@company.com",
  "service": "web",
  "details": "Enterprise Next.js 15 deployment..."
}
```
