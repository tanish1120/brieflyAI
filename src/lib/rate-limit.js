// Simple in-memory rate limiter
const rateLimits = new Map();

function checkRateLimit(userId, maxPerDay = 10) {
  const today = new Date().toDateString();
  const key = `${userId}-${today}`;

  const current = rateLimits.get(key) || 0;

  if (current >= maxPerDay) {
    return false;
  }

  rateLimits.set(key, current + 1);
  return true;
}

module.exports = { checkRateLimit };