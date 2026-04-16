/* ============================================================
   API Layer (api.js)

   Connects to the Spring Boot backend at localhost:8080.
   
   Backend endpoints discovered from GitHub:
   - POST /auth/register  → User entity (username, password)
   - POST /auth/login     → returns JWT token as plain string
   - POST /api/quantity/convert  → returns QuantityDTO
   - POST /api/quantity/compare  → returns boolean
   - POST /api/quantity/add      → returns QuantityDTO
   - POST /api/quantity/subtract → returns QuantityDTO
   - POST /api/quantity/divide   → returns double
   - GET  /api/quantity/getHistory → returns List<QuantityMeasurementEntity>
   ============================================================ */

// ---- Backend Server URL ----
// Using empty string so Vite proxy forwards /auth and /api to localhost:8080
// This avoids CORS issues during development
const API_BASE = "";

/* ============================================================
   TOKEN MANAGEMENT (JWT Authentication)
   ============================================================ */

export function getToken() {
  return localStorage.getItem("jwt_token");
}

export function setToken(token) {
  localStorage.setItem("jwt_token", token);
}

export function removeToken() {
  localStorage.removeItem("jwt_token");
}

export function isLoggedIn() {
  return !!getToken();
}

function authHeaders() {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }
  return headers;
}

/* ============================================================
   REGISTER (Sign Up) API
   
   Backend User entity has: username, password
   POST /auth/register
   ============================================================ */
export async function apiRegister(userData) {
  const response = await fetch(API_BASE + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    // Try to get error message from response
    const text = await response.text();
    let errorMessage = "Registration failed";
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // Backend returns User object
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/* ============================================================
   LOGIN API
   
   Backend returns JWT token as a PLAIN STRING (not JSON object).
   POST /auth/login
   Body: { username, password }
   ============================================================ */
export async function apiLogin(credentials) {
  const response = await fetch(API_BASE + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = "Login failed";
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // Backend returns JWT as plain string, NOT { token: "..." }
  const token = await response.text();

  if (token) {
    // Remove any surrounding quotes if present
    const cleanToken = token.replace(/^"|"$/g, '');
    setToken(cleanToken);
  }

  return { token };
}

/* ============================================================
   LOGOUT
   ============================================================ */
export function apiLogout() {
  removeToken();
}

/* ============================================================
   QUANTITY OPERATION API
   
   All operations use POST /api/quantity/{operation}
   Request body: TwoQuantityRequest { q1: QuantityDTO, q2: QuantityDTO, targetUnit: QuantityDTO }
   
   Response types:
   - compare  → boolean (true/false)
   - convert  → QuantityDTO { value, unit, measurementType }
   - add      → QuantityDTO { value, unit, measurementType }
   - subtract → QuantityDTO { value, unit, measurementType }
   - divide   → double (plain number)
   ============================================================ */
export async function apiQuantityOperation(operation, requestBody) {
  const url = API_BASE + "/api/quantity/" + operation;

  const response = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = operation + " failed";
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  // Response could be boolean, number, or JSON object depending on operation
  const text = await response.text();
  
  // Try to parse as JSON first
  try {
    return JSON.parse(text);
  } catch {
    // For divide (returns plain number) or compare (returns plain boolean)
    if (text === "true" || text === "false") {
      return text === "true";
    }
    const num = Number(text);
    if (!isNaN(num)) {
      return num;
    }
    return text;
  }
}

/* ============================================================
   HISTORY API
   
   GET /api/quantity/getHistory
   Returns: List<QuantityMeasurementEntity>
   
   Entity fields:
   - id, thisValue, thisUnit, thisMeasurementType
   - thatValue, thatUnit, thatMeasurementType
   - operation, resultValue, resultUnit, resultMeasurementType
   - resultString, isError, errorMessage
   - createdAt, updatedAt
   ============================================================ */
export async function apiGetHistory() {
  const response = await fetch(API_BASE + "/api/quantity/getHistory", {
    method: "GET",
    headers: authHeaders()
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("UNAUTHORIZED");
    }
    const text = await response.text();
    let errorMessage = "Failed to fetch history";
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.message || errorMessage;
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}
