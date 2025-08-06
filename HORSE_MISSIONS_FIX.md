# Horse Missions Fix Summary

## Problem
The missions for horses (paarden) were not working properly. When clicking on a horse, the mission modal would open but without the "Selecteer uit Rugzak" (Select from Backpack) button, making it impossible to complete missions.

## Root Cause
The horse missions were using a simplified modal implementation in `animals.js` that didn't have inventory integration, while the guinea pig missions used the more sophisticated `MissionManager` class with full inventory support.

## Solution

### 1. Updated AnimalChallenge class (animals.js)
- Added import for `MissionManager`
- Added `missionManager` instance to the `AnimalChallenge` constructor
- Updated `showMissionModal` to use the `MissionManager` instead of creating its own modal
- Updated `handleMissionItem` to properly update progress through the `MissionManager`

### 2. Updated Inventory System (inventory.js)
- Renamed `giveItemToMissionPig` to `giveItemToMissionAnimal` to be more generic
- Added logic to handle both guinea pig missions and other animal missions
- The method now checks the current world and calls the appropriate mission completion handler

## How It Works Now

1. Click on a horse with a mission (indicated by the yellow exclamation mark)
2. The mission modal opens with the "Selecteer uit Rugzak" button
3. Click the button to open the inventory
4. Select the required item from inventory
5. The item is given to the horse and mission progress is updated
6. When the mission is complete, the player receives carrots as a reward
7. The horse gets a new random mission

## Files Modified

1. `/workspace/js/animals.js`
   - Added MissionManager import and instance
   - Updated showMissionModal and handleMissionItem methods

2. `/workspace/js/inventory.js`
   - Renamed and updated giveItemToMissionPig to giveItemToMissionAnimal
   - Added support for different animal types based on current world

## Testing

A test file has been created at `/workspace/test-horse-missions.html` to verify the functionality:
- Go to the horse world (paarden)
- Add test items to inventory
- Click on horses to test missions
- Verify that the inventory integration works correctly

The horse missions should now work exactly like the guinea pig missions, with full inventory integration and proper progress tracking.