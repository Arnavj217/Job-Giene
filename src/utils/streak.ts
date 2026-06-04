import { Profile } from "../types";

export const getLocalDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Validates the current profile and resets streak to 0 if the user has missed yesterday/today.
 * This should be run on app mount or dashboard load to show the true live state.
 */
export const checkLapsedStreak = (profile: Profile): Profile => {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();
  const dates = profile.streakDates || [];
  
  if (dates.length > 0) {
    const lastActiveDate = dates[dates.length - 1];
    if (lastActiveDate !== today && lastActiveDate !== yesterday) {
      if (profile.streak !== 0) {
        return {
          ...profile,
          streak: 0
        };
      }
    }
  }
  return profile;
};

/**
 * Records a new useful career activity.
 * Increases the streak by 1 if today is consecutive to yesterday, or resets to 1 if lapsed.
 * Automatically handles milestone badges.
 */
export const recordActivityStreak = (profile: Profile): { updatedProfile: Profile, increased: boolean } => {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();
  const dates = [...(profile.streakDates || [])];
  
  // If already did useful work today, just maintain
  if (dates.includes(today)) {
    return { updatedProfile: profile, increased: false };
  }
  
  let newStreak = profile.streak || 0;
  if (dates.length === 0) {
    newStreak = 1;
  } else {
    const lastActiveDate = dates[dates.length - 1];
    if (lastActiveDate === yesterday) {
      newStreak += 1;
    } else {
      // Clear break, reset to 1
      newStreak = 1;
    }
  }
  
  dates.push(today);
  
  // Award milestones
  const newBadges = [...(profile.badges || [])];
  if (newStreak >= 7 && !newBadges.includes("Bronze Streak Badge")) {
    newBadges.push("Bronze Streak Badge");
  }
  if (newStreak >= 30 && !newBadges.includes("Silver Streak Badge")) {
    newBadges.push("Silver Streak Badge");
  }
  if (newStreak >= 100 && !newBadges.includes("Gold Streak Badge")) {
    newBadges.push("Gold Streak Badge");
  }
  
  const updatedProfile: Profile = {
    ...profile,
    streak: newStreak,
    streakDates: dates,
    badges: newBadges
  };
  
  return { updatedProfile, increased: true };
};
