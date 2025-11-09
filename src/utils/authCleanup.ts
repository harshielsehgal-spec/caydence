/**
 * Auth cleanup utilities for resetting local auth state
 */

/**
 * Clear all local authentication caches and storage
 * Call this when you need a completely fresh auth state
 */
export const clearAllAuthCaches = () => {
  // Clear localStorage auth keys
  const keysToRemove = [
    'supabase.auth.token',
    'sb-vmkunabmqtqslwrgitpu-auth-token',
    'currentRole',
    'coachDraft',
    'email',
    'password',
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  // Clear all cadenceSwipeState entries
  Object.keys(localStorage)
    .filter(key => key.includes('cadenceSwipeState_'))
    .forEach(key => localStorage.removeItem(key));

  // Clear sessionStorage
  sessionStorage.clear();

  // Clear IndexedDB (Supabase auth cache)
  if (window.indexedDB) {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });
    }).catch(err => {
      if (import.meta.env.DEV) {
        console.error('Error clearing IndexedDB:', err);
      }
    });
  }

  console.log('✅ All auth caches cleared');
};

/**
 * Sign out and clear all caches
 * Use this for a complete auth reset
 */
export const signOutAndClearAll = async (supabase: any) => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all local caches
    clearAllAuthCaches();
    
    console.log('✅ Signed out and cleared all caches');
    return { success: true };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error during sign out:', error);
    }
    return { success: false, error };
  }
};
