import { User, Plan } from "../types";

const USER_KEY = "trackstock_user";
const OWNER_EMAIL = "owner@trackstock.io";

// Event target for auth changes
export const authEvents = new EventTarget();

export const getSession = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export const login = (email: string, initialPlan: Plan): User => {
  let plan = initialPlan;
  let name = email.split('@')[0];

  // Special Owner Logic
  if (email.toLowerCase() === OWNER_EMAIL) {
      plan = Plan.OWNER;
      name = "The Owner";
      // Simulate confirmation email log
      console.log(`[System] Confirmation email sent to ${email} for Owner Account verification.`);
  }

  const user: User = {
    email,
    plan,
    name,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  authEvents.dispatchEvent(new Event('auth-change'));
  return user;
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
  authEvents.dispatchEvent(new Event('auth-change'));
};

export const upgradePlan = (plan: Plan) => {
  const user = getSession();
  if (user) {
    user.plan = plan;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    authEvents.dispatchEvent(new Event('auth-change'));
  }
};