# Mission Modal Close Button Fix

## Problem
The mission modal could not be closed when clicking the close button (✖), causing the game to become blocked.

## Root Cause
The issue was in the `setupMissionModal()` function in `/workspace/js/guinea-pig-missions.js`. The mission content had an event listener that called `e.stopPropagation()` on ALL click events, including clicks on the close button. This prevented the close button's click event from reaching the DOM manager's close handler.

## Solution
Modified the click event handler on the mission content to check if the clicked element is the close button. If it is, the event is allowed to propagate normally. If it's any other element, propagation is stopped as intended.

### Code Changes
In `guinea-pig-missions.js`, line 99-101:

**Before:**
```javascript
missionContent.addEventListener('click', (e) => {
    e.stopPropagation();
});
```

**After:**
```javascript
missionContent.addEventListener('click', (e) => {
    // Don't stop propagation if clicking the close button
    if (!e.target.matches('#closeMission')) {
        e.stopPropagation();
    }
});
```

### Additional Enhancement
Also added a click handler on the modal background to close the modal when clicking outside the content area:

```javascript
this.missionModal.addEventListener('click', (e) => {
    if (e.target === this.missionModal) {
        this.closeMissionModal();
    }
});
```

## Testing
You can test the fix by:
1. Opening the game
2. Clicking on a guinea pig with a mission
3. The mission modal should open
4. Clicking the ✖ button should now properly close the modal
5. Clicking outside the modal content (on the dark background) should also close it
6. The Escape key should still work to close the modal

The game should no longer be blocked when the mission modal is open.