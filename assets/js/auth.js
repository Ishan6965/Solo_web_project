const AUTH_STORAGE_KEY = "movie_dashboard_auth";
const FLOW_STORAGE_KEY = "movie_dashboard_flow_started";

function getAuthState() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (_) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function isAuthenticated() {
  return Boolean(getAuthState()?.email);
}

function login(user) {
  const state = {
    email: user?.email || "",
    userId: user?._id || "",
    loggedInAt: Date.now()
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function markFlowStarted() {
  sessionStorage.setItem(FLOW_STORAGE_KEY, "1");
}

function clearFlow() {
  sessionStorage.removeItem(FLOW_STORAGE_KEY);
}

function isFlowStarted() {
  return sessionStorage.getItem(FLOW_STORAGE_KEY) === "1";
}

function requireFlowStart(redirectTo = "index.html") {
  if (!isAuthenticated() && !isFlowStarted()) {
    window.location.replace(redirectTo);
  }
}

function requireAuth(redirectTo = "login.html") {
  if (!isAuthenticated()) {
    const next = encodeURIComponent(window.location.pathname.split("/").pop());
    window.location.replace(`${redirectTo}?next=${next}`);
  }
}

function redirectIfAuthenticated(redirectTo = "search.html") {
  if (isAuthenticated()) {
    window.location.replace(redirectTo);
  }
}

window.Auth = {
  getAuthState,
  isAuthenticated,
  login,
  logout,
  markFlowStarted,
  clearFlow,
  isFlowStarted,
  requireFlowStart,
  requireAuth,
  redirectIfAuthenticated
};
