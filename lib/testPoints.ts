import { addPointsToUser, getGlobalLeaderboard, getFriendsLeaderboard, getUserRank } from './points';
import { supabase } from './supabase';

// Testovací funkce pro přidání bodů aktuálnímu uživateli
export async function testAddPoints(points: number = 100) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    const result = await addPointsToUser(user.id, points, 'Test points');
    console.log('Points added:', result);
    return result;
  } catch (error) {
    console.error('Error testing points:', error);
  }
}

// Testovací funkce pro zobrazení leaderboardu
export async function testLeaderboard() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      return;
    }

    console.log('=== GLOBAL LEADERBOARD ===');
    const globalResult = await getGlobalLeaderboard(10);
    console.log('Global leaderboard:', globalResult);

    console.log('=== FRIENDS LEADERBOARD ===');
    const friendsResult = await getFriendsLeaderboard(user.id, 10);
    console.log('Friends leaderboard:', friendsResult);

    console.log('=== USER RANK ===');
    const rankResult = await getUserRank(user.id);
    console.log('User rank:', rankResult);
  } catch (error) {
    console.error('Error testing leaderboard:', error);
  }
}