export function launch() {
  const mostRecentSunday = getMostRecentSunday();
  return mostRecentSunday;
}

export function readHistory() {

}

export function getMostRecentSunday() {
  const today = new Date();
  const todayAsInt = today.getDay();
  const most_recent_sunday = (todayAsInt == 0) ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() - todayAsInt).toLocaleDateString();
  return most_recent_sunday;
}