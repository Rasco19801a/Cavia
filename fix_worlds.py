#!/usr/bin/env python3
import re

# Read the original file
with open('/workspace/js/worlds.js', 'r') as f:
    content = f.read()

# 1. Add 'thuis' case to the switch statement in getOrCreateBackgroundCanvas
pattern1 = r"(        case 'paarden':\n            drawPaardenBackground\(bgCtx\);\n            break;\n)(        // Add more world types as needed)"
replacement1 = r"\1        case 'thuis':\n            drawThuisBackground(bgCtx);\n            break;\n\2"
content = re.sub(pattern1, replacement1, content)

# 2. Add drawThuisBackground function before drawNatuurBackground
thuis_background_func = '''// Background drawing function for home world
function drawThuisBackground(ctx) {
    // Modern home interior background
    // Walls - warm gray
    ctx.fillStyle = '#E8E0D5';
    ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    
    // Wooden floor
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(0, 550, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT - 550);
    
    // Floor boards detail
    ctx.strokeStyle = '#6B5637';
    ctx.lineWidth = 2;
    for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 550);
        ctx.lineTo(x, CONFIG.WORLD_HEIGHT);
        ctx.stroke();
    }
    
    // Draw all static furniture
    drawThuisFurniture(ctx);
}

'''

# Insert the new function before drawNatuurBackground
pattern2 = r"(// Background drawing functions for static elements\n)(function drawNatuurBackground)"
replacement2 = r"\1" + thuis_background_func + r"\2"
content = re.sub(pattern2, replacement2, content)

# 3. Create drawThuisFurniture function from existing drawThuis content
# Extract furniture drawing code from drawThuis
furniture_code_pattern = r"function drawThuis\(ctx\) \{[^}]*// 1\. BANK \(SOFA\)(.*?)// Add more decorative elements.*?\n    ctx\.fillRect\(1730, 490, 40, 50\);\n\}"
furniture_match = re.search(furniture_code_pattern, content, re.DOTALL)

if furniture_match:
    furniture_code = furniture_match.group(0)
    # Transform it to drawThuisFurniture
    furniture_code = furniture_code.replace('function drawThuis(ctx)', 'function drawThuisFurniture(ctx)')
    # Remove the background drawing parts (walls and floor) - they're now in drawThuisBackground
    furniture_code = re.sub(r'    // Modern home interior background.*?    \}\n', '', furniture_code, flags=re.DOTALL)
    
    # 4. Replace the existing drawThuis function with a simpler one that uses cache
    new_draw_thuis = '''function drawThuis(ctx) {
    // Use cached background for home world
    const bgCanvas = getOrCreateBackgroundCanvas('thuis', CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);
    ctx.drawImage(bgCanvas, 0, 0);
}'''
    
    # Replace the entire drawThuis function
    content = re.sub(r'function drawThuis\(ctx\) \{.*?\n\}', new_draw_thuis, content, flags=re.DOTALL)
    
    # Add drawThuisFurniture function after drawThuis
    content = content.replace(new_draw_thuis, new_draw_thuis + '\n\n' + furniture_code)

# Write the modified content
with open('/workspace/js/worlds.js', 'w') as f:
    f.write(content)

print("Successfully fixed worlds.js!")
print("Changes made:")
print("1. Added 'thuis' case to background cache switch statement")
print("2. Added drawThuisBackground function for cached background")
print("3. Added drawThuisFurniture function for static furniture")
print("4. Modified drawThuis to use cached background")