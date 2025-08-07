// Animal drawing functions for different animal types

// Helper function for name and glow
export function drawNameAndGlow(ctx, animal, screenX, screenY, scale) {
    // Name label
    ctx.restore();
    ctx.fillStyle = 'black';
    ctx.font = '12px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(animal.name, screenX, screenY + 40);

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Interactive glow
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.stroke();
}

// Hond (Dog)
export function drawHond(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (more dog-like proportions)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 12, 35, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head (rounder)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-25, -15, 28, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout (more prominent)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-42, -8, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (floppy and more realistic)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-38, -32, 10, 20, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-12, -32, 10, 20, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Tail (wagging position)
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(42, -5);
    ctx.bezierCurveTo(58, -15, 62, -5, 65, 5);
    ctx.stroke();

    // Legs (all four visible)
    ctx.fillStyle = animal.color.body;
    // Front legs
    ctx.beginPath();
    ctx.ellipse(-20, 20, 9, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-5, 20, 9, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    // Back legs
    ctx.beginPath();
    ctx.ellipse(20, 20, 9, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(35, 20, 9, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (friendly)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(-32, -15, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-18, -18, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-32, -15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-18, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-48, -8, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Kat (Cat)
export function drawKat(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 30, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (more rounded and cat-like)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(5, 0, 38, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(5, 12, 25, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head (rounder)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(-20, -15, 25, 0, Math.PI * 2);
    ctx.fill();

    // Ears (more triangular and cat-like)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(-38, -28);
    ctx.lineTo(-32, -45);
    ctx.lineTo(-24, -32);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-16, -32);
    ctx.lineTo(-8, -45);
    ctx.lineTo(-2, -28);
    ctx.closePath();
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(-34, -33);
    ctx.lineTo(-32, -40);
    ctx.lineTo(-28, -33);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-12, -33);
    ctx.lineTo(-8, -40);
    ctx.lineTo(-6, -33);
    ctx.closePath();
    ctx.fill();

    // Tail (more elegant S-curve)
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(38, 0);
    ctx.bezierCurveTo(55, -10, 55, -30, 48, -40);
    ctx.stroke();

    // Legs (all four legs visible)
    ctx.fillStyle = animal.color.body;
    // Front legs
    ctx.beginPath();
    ctx.ellipse(-18, 22, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-5, 22, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    // Back legs
    ctx.beginPath();
    ctx.ellipse(15, 22, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(28, 22, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (more almond-shaped)
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.ellipse(-28, -15, 5, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-12, -15, 5, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils (vertical slits for cat)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-28, -15, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-12, -15, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.moveTo(-20, -8);
    ctx.lineTo(-17, -5);
    ctx.lineTo(-23, -5);
    ctx.closePath();
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-30, -10);
    ctx.lineTo(-40, -12);
    ctx.moveTo(-30, -8);
    ctx.lineTo(-40, -8);
    ctx.moveTo(-10, -10);
    ctx.lineTo(0, -12);
    ctx.moveTo(-10, -8);
    ctx.lineTo(0, -8);
    ctx.stroke();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Cavia (Guinea Pig)
export function drawCavia(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 35, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (rounder and more guinea pig-like)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 45, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 12, 30, 18, 0, 0, Math.PI);
    ctx.fill();

    // Head (more integrated with body)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-5, -20, 32, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (smaller and rounder)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-18, -35, 12, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -35, 12, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-18, -35, 6, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -35, 6, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Feet (small and cute)
    ctx.fillStyle = animal.color.body;
    // Front feet
    ctx.beginPath();
    ctx.ellipse(-22, 25, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-8, 25, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Back feet
    ctx.beginPath();
    ctx.ellipse(8, 25, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(22, 25, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (bigger and more expressive)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(-12, -20, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -20, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-12, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-14, -22, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -22, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose (more prominent)
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(-5, -8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (Y-shaped)
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(-5, -2);
    ctx.moveTo(-5, -2);
    ctx.lineTo(-8, 0);
    ctx.moveTo(-5, -2);
    ctx.lineTo(-2, 0);
    ctx.stroke();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Duif (Pigeon)
export function drawDuif(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 20, 20, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -30, 18, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, -15, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-20, 0, 15, 25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, 0, 15, 25, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(-10, 25);
    ctx.lineTo(0, 40);
    ctx.lineTo(10, 25);
    ctx.closePath();
    ctx.fill();

    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(-5, -20);
    ctx.lineTo(5, -20);
    ctx.closePath();
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-8, -30, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -30, 3, 0, Math.PI * 2);
    ctx.fill();

    // Feet
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, 30);
    ctx.lineTo(-10, 40);
    ctx.moveTo(-10, 40);
    ctx.lineTo(-15, 45);
    ctx.moveTo(-10, 40);
    ctx.lineTo(-5, 45);
    ctx.moveTo(10, 30);
    ctx.lineTo(10, 40);
    ctx.moveTo(10, 40);
    ctx.lineTo(15, 45);
    ctx.moveTo(10, 40);
    ctx.lineTo(5, 45);
    ctx.stroke();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Konijn (Rabbit)
export function drawKonijn(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 28, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (more oval and upright)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 5, 38, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 15, 28, 20, 0, 0, Math.PI);
    ctx.fill();

    // Head (rounder)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -20, 28, 0, Math.PI * 2);
    ctx.fill();

    // Long ears (more prominent)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-12, -45, 10, 30, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, -45, 10, 30, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-12, -45, 5, 25, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, -45, 5, 25, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Front paws
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-12, 20, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, 20, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Back legs (larger)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-18, 28, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(18, 28, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (fluffy cotton tail)
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.arc(35, 5, 15, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (larger and more expressive)
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.ellipse(-12, -20, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(12, -20, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-12, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-14, -22, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -22, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose (Y-shaped like rabbit)
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(0, -10, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(0, -4);
    ctx.moveTo(0, -4);
    ctx.lineTo(-3, -2);
    ctx.moveTo(0, -4);
    ctx.lineTo(3, -2);
    ctx.stroke();

    // Whiskers
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-18, -12);
    ctx.lineTo(-28, -14);
    ctx.moveTo(-18, -10);
    ctx.lineTo(-28, -10);
    ctx.moveTo(18, -12);
    ctx.lineTo(28, -14);
    ctx.moveTo(18, -10);
    ctx.lineTo(28, -10);
    ctx.stroke();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Leeuw (Lion)
export function drawLeeuw(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mane
    ctx.fillStyle = '#B8860B';
    ctx.beginPath();
    ctx.arc(0, -15, 40, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(10, 0, 45, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(10, 10, 30, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head (on top of mane)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -15, 28, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(-20, -30, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -30, 10, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = animal.color.body;
    for (let i = 0; i < 4; i++) {
        const x = -15 + (i % 2) * 40;
        const y = 20 + Math.floor(i / 2) * 5;
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 18, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tail
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.quadraticCurveTo(65, 10, 70, 5);
    ctx.stroke();
    
    // Tail tuft
    ctx.fillStyle = '#B8860B';
    ctx.beginPath();
    ctx.arc(70, 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-10, -15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -15, 4, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();

    // Mouth
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-8, 5);
    ctx.moveTo(0, 0);
    ctx.lineTo(8, 5);
    ctx.stroke();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Vis (Fish)
export function drawVis(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 5, 30, 10, 0, 0, Math.PI);
    ctx.fill();

    // Tail
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.lineTo(50, -15);
    ctx.lineTo(50, 15);
    ctx.closePath();
    ctx.fill();

    // Top fin
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(-10, -15);
    ctx.lineTo(0, -25);
    ctx.lineTo(10, -15);
    ctx.closePath();
    ctx.fill();

    // Side fins
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-10, 5, 8, 15, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, 5, 8, 15, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-20, -5, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-20, -5, 4, 0, Math.PI * 2);
    ctx.fill();

    // Scales pattern
    ctx.strokeStyle = animal.color.belly;
    ctx.lineWidth = 1;
    for (let i = -15; i < 25; i += 10) {
        ctx.beginPath();
        ctx.arc(i, 0, 8, -Math.PI/3, Math.PI/3);
        ctx.stroke();
    }

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Flamingo
export function drawFlamingo(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, -10, 25, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck (S-curve)
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.quadraticCurveTo(-10, -45, 0, -60);
    ctx.quadraticCurveTo(10, -75, 0, -90);
    ctx.stroke();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -90, 12, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(-10, -90);
    ctx.quadraticCurveTo(-15, -85, -10, -80);
    ctx.lineTo(-5, -85);
    ctx.closePath();
    ctx.fill();

    // Wing
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(10, -10, 15, 25, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-5, 15);
    ctx.lineTo(-5, 40);
    ctx.moveTo(5, 15);
    ctx.lineTo(5, 40);
    ctx.stroke();

    // Feet
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-5, 40);
    ctx.lineTo(-10, 45);
    ctx.moveTo(-5, 40);
    ctx.lineTo(0, 45);
    ctx.moveTo(5, 40);
    ctx.lineTo(0, 45);
    ctx.moveTo(5, 40);
    ctx.lineTo(10, 45);
    ctx.stroke();

    // Eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-5, -90, 3, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Kikker (Frog)
export function drawKikker(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 5, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 25, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, -15, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (bulging)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(-20, -20, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -20, 12, 0, Math.PI * 2);
    ctx.fill();

    // Eye whites
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-20, -20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -20, 10, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-20, -20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, -20, 5, 0, Math.PI * 2);
    ctx.fill();

    // Front legs
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-20, 15, 8, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, 15, 8, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Back legs (bent)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-25, 10, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(25, 10, 15, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Webbed feet
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(-20, 30);
    ctx.lineTo(-25, 35);
    ctx.lineTo(-15, 35);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(20, 30);
    ctx.lineTo(15, 35);
    ctx.lineTo(25, 35);
    ctx.closePath();
    ctx.fill();

    // Mouth
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -5, 20, 0, Math.PI);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-5, -10, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -10, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Koe (Cow)
export function drawKoe(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 35, 40, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 50, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spots
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(-20, -5, 15, 10, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, 5, 12, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -10, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Udder
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(25, 15, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-35, -15, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-45, -10, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.strokeStyle = '#F5F5DC';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-40, -30);
    ctx.lineTo(-45, -35);
    ctx.moveTo(-30, -30);
    ctx.lineTo(-25, -35);
    ctx.stroke();

    // Ears
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-45, -20, 8, 12, -0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-25, -25, 8, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = animal.color.body;
    for (let i = 0; i < 4; i++) {
        const x = -25 + (i % 2) * 45;
        const y = 20 + Math.floor(i / 2) * 5;
        ctx.beginPath();
        ctx.rect(x - 5, y, 10, 20);
        ctx.fill();
        
        // Hooves
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.rect(x - 5, y + 18, 10, 5);
        ctx.fill();
        ctx.fillStyle = animal.color.body;
    }

    // Tail
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(45, -5);
    ctx.quadraticCurveTo(55, 10, 50, 25);
    ctx.stroke();
    
    // Tail tuft
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(50, 25, 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-40, -15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-30, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nostrils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-48, -10, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-42, -10, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Paard (Horse) - Cute style like uploaded image
export function drawPaard(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 65, 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Back legs (behind body)
    ctx.fillStyle = animal.color.body;
    // Left back leg
    ctx.fillRect(-25, 25, 18, 40);
    // Right back leg
    ctx.fillRect(7, 25, 18, 40);

    // Body (round and cute)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 45, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly (large cream oval)
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Front legs
    ctx.fillStyle = animal.color.body;
    // Left front leg
    ctx.fillRect(-20, 25, 18, 40);
    // Right front leg
    ctx.fillRect(2, 25, 18, 40);

    // Hooves (dark brown)
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(-25, 60, 18, 8);
    ctx.fillRect(7, 60, 18, 8);
    ctx.fillRect(-20, 60, 18, 8);
    ctx.fillRect(2, 60, 18, 8);

    // Head (round and cute)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -35, 30, 0, Math.PI * 2);
    ctx.fill();

    // Snout (light colored)
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, -25, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nostrils (pink)
    ctx.fillStyle = '#DDA0DD';
    ctx.beginPath();
    ctx.ellipse(-8, -25, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -25, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (triangular and cute)
    ctx.fillStyle = animal.color.body;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-15, -55);
    ctx.lineTo(-10, -40);
    ctx.lineTo(-20, -40);
    ctx.closePath();
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(15, -55);
    ctx.lineTo(20, -40);
    ctx.lineTo(10, -40);
    ctx.closePath();
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.moveTo(-15, -50);
    ctx.lineTo(-13, -42);
    ctx.lineTo(-17, -42);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(15, -50);
    ctx.lineTo(17, -42);
    ctx.lineTo(13, -42);
    ctx.closePath();
    ctx.fill();

    // Mane (cute and fluffy)
    ctx.fillStyle = '#8B5A3C';
    // Top mane
    ctx.beginPath();
    ctx.arc(0, -50, 15, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Side mane parts
    ctx.beginPath();
    ctx.moveTo(-15, -45);
    ctx.quadraticCurveTo(-25, -40, -20, -30);
    ctx.quadraticCurveTo(-15, -25, -10, -30);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(15, -45);
    ctx.quadraticCurveTo(25, -40, 20, -30);
    ctx.quadraticCurveTo(15, -25, 10, -30);
    ctx.closePath();
    ctx.fill();

    // Eyes (simple black dots)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-10, -35, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, -35, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// --- NEW: Exact cute variant to match provided image ---
export function drawPaardCute(ctx, animal, screenX, screenY, scale) {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    const bodyColor = animal.color?.body || '#B8824D';
    const bellyColor = animal.color?.belly || '#F5DEB3';
    const maneColor = '#8B5A3C';
    const hoofColor = '#6B4423';
    const innerEarColor = '#D2B48C';
    const nostrilColor = '#DDA0DD';

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 20, 60, 55, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(0, 35, 45, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(0, -40, 40, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle/Snout
    ctx.fillStyle = bellyColor;
    ctx.beginPath();
    ctx.ellipse(0, -25, 28, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.moveTo(-20, -70);
    ctx.lineTo(-10, -50);
    ctx.lineTo(-30, -50);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, -70);
    ctx.lineTo(30, -50);
    ctx.lineTo(10, -50);
    ctx.closePath();
    ctx.fill();

    // Inner ears
    ctx.fillStyle = innerEarColor;
    ctx.beginPath();
    ctx.moveTo(-20, -65);
    ctx.lineTo(-15, -53);
    ctx.lineTo(-25, -53);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, -65);
    ctx.lineTo(25, -53);
    ctx.lineTo(15, -53);
    ctx.closePath();
    ctx.fill();

    // Mane
    ctx.fillStyle = maneColor;
    ctx.beginPath();
    ctx.arc(0, -65, 18, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    // Front mane strands
    ctx.beginPath();
    ctx.moveTo(-15, -60);
    ctx.quadraticCurveTo(-20, -55, -15, -50);
    ctx.quadraticCurveTo(-10, -45, -5, -50);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(15, -60);
    ctx.quadraticCurveTo(20, -55, 15, -50);
    ctx.quadraticCurveTo(10, -45, 5, -50);
    ctx.closePath();
    ctx.fill();

    // Legs
    ctx.fillStyle = bodyColor;
    ctx.fillRect(-30, 60, 20, 50);
    ctx.fillRect(10, 60, 20, 50);
    ctx.fillRect(-35, 60, 20, 50);
    ctx.fillRect(15, 60, 20, 50);

    // Hooves
    ctx.fillStyle = hoofColor;
    ctx.fillRect(-30, 105, 20, 10);
    ctx.fillRect(10, 105, 20, 10);
    ctx.fillRect(-35, 105, 20, 10);
    ctx.fillRect(15, 105, 20, 10);

    // Nostrils
    ctx.fillStyle = nostrilColor;
    ctx.beginPath();
    ctx.ellipse(-10, -20, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, -20, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-15, -40, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, -40, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    drawNameAndGlow(ctx, animal, screenX, screenY, scale);
    ctx.restore();
}

// Export all drawing functions
export const animalDrawers = {
    hond: drawHond,
    kat: drawKat,
    cavia: drawCavia,
    duif: drawDuif,
    konijn: drawKonijn,
    leeuw: drawLeeuw,
    vis: drawVis,
    flamingo: drawFlamingo,
    kikker: drawKikker,
    koe: drawKoe,
    paard: drawPaard
};

// Main drawing function
export function drawAnimal(ctx, animal, screenX, screenY, scale = 0.4) {
    // If a horse has variant 'cute', use the exact cute drawing
    if (animal.type === 'paard' && animal.variant === 'cute') {
        return drawPaardCute(ctx, animal, screenX, screenY, scale);
    }
    const drawFunc = animalDrawers[animal.type];
    if (drawFunc) {
        drawFunc(ctx, animal, screenX, screenY, scale);
    } else {
        // Fallback to guinea pig style
        drawCavia(ctx, animal, screenX, screenY, scale);
    }
}