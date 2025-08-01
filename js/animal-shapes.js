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
    ctx.ellipse(0, 35, 35, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (elongated)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 45, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 30, 12, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-25, -15, 25, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snout
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-40, -10, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears (floppy)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-35, -30, 8, 18, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-15, -30, 8, 18, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(40, -5);
    ctx.quadraticCurveTo(55, -15, 60, -5);
    ctx.stroke();

    // Legs
    ctx.fillStyle = animal.color.body;
    for (let i = 0; i < 4; i++) {
        const x = -20 + (i % 2) * 40;
        const y = 15 + Math.floor(i / 2) * 5;
        ctx.beginPath();
        ctx.ellipse(x, y, 8, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-30, -15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-20, -18, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-45, -10, 4, 3, 0, 0, Math.PI * 2);
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
    ctx.ellipse(0, 35, 25, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(5, 0, 35, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(5, 10, 22, 12, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(-20, -15, 22, 0, Math.PI * 2);
    ctx.fill();

    // Ears (pointed)
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.moveTo(-35, -25);
    ctx.lineTo(-30, -40);
    ctx.lineTo(-25, -25);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-15, -25);
    ctx.lineTo(-10, -40);
    ctx.lineTo(-5, -25);
    ctx.closePath();
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(-32, -30);
    ctx.lineTo(-30, -36);
    ctx.lineTo(-28, -30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-12, -30);
    ctx.lineTo(-10, -36);
    ctx.lineTo(-8, -30);
    ctx.closePath();
    ctx.fill();

    // Tail (curved)
    ctx.strokeStyle = animal.color.body;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(35, 0);
    ctx.quadraticCurveTo(50, -20, 45, -35);
    ctx.stroke();

    // Legs
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-15, 20, 7, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, 20, 7, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.ellipse(-25, -15, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-15, -15, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(-25, -15, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-15, -15, 2, 4, 0, 0, Math.PI * 2);
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
    ctx.ellipse(0, 35, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 10, 25, 15, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, -20, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-15, -30, 10, 15, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, -30, 10, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Feet
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-20, 20, 10, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(20, 20, 10, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-10, -20, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -20, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(0, -10, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

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
    ctx.ellipse(0, 35, 25, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(0, 5, 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.ellipse(0, 15, 25, 18, 0, 0, Math.PI);
    ctx.fill();

    // Head
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.arc(0, -20, 25, 0, Math.PI * 2);
    ctx.fill();

    // Long ears
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-10, -40, 8, 25, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, -40, 8, 25, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-10, -40, 4, 20, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, -40, 4, 20, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Paws
    ctx.fillStyle = animal.color.body;
    ctx.beginPath();
    ctx.ellipse(-15, 25, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, 25, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail (fluffy)
    ctx.fillStyle = animal.color.belly;
    ctx.beginPath();
    ctx.arc(30, 5, 12, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-10, -20, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -20, 4, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(0, -12, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-15, -12);
    ctx.lineTo(-25, -14);
    ctx.moveTo(-15, -10);
    ctx.lineTo(-25, -10);
    ctx.moveTo(15, -12);
    ctx.lineTo(25, -14);
    ctx.moveTo(15, -10);
    ctx.lineTo(25, -10);
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
    koe: drawKoe
};

// Main drawing function
export function drawAnimal(ctx, animal, screenX, screenY, scale = 0.4) {
    const drawFunc = animalDrawers[animal.type];
    if (drawFunc) {
        drawFunc(ctx, animal, screenX, screenY, scale);
    } else {
        // Fallback to guinea pig style
        drawCavia(ctx, animal, screenX, screenY, scale);
    }
}