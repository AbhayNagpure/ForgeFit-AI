import React, { useState } from 'react';

const EXERCISE_LIBRARY = [
  // Upper Chest
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Incline Barbell Bench Press', rating: 'Essential', target: 'Best for overall upper chest mass', tips: ['Bench angle: 30–45°', 'Elbows about 45–60° from your body', 'Lower bar to upper chest'], videoPlaceholder: '/animations/barbell_incline_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Incline Dumbbell Press', rating: 'Essential', target: 'Better stretch than barbell', tips: ['Press upward in a slight arc', 'Don\'t slam dumbbells together'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Low-to-High Cable Fly', rating: 'Recommended', target: 'Upper chest isolation', tips: ['Start handles near hips', 'Bring hands upward toward eye level', 'Slight bend in elbows'], videoPlaceholder: '/gifs/0013.gif' },
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Reverse-Grip Bench Press', rating: 'Optional', target: 'More upper chest activation', tips: ['Underhand grip', 'Requires good technique'], videoPlaceholder: '/gifs/0009.gif' },
  
  // Middle Chest
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Flat Barbell Bench Press', rating: 'Essential', target: 'King of chest exercises', tips: ['Feet planted', 'Shoulder blades retracted', 'Lower to mid chest'], videoPlaceholder: '/animations/barbell_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Flat Dumbbell Press', rating: 'Essential', target: 'Greater range of motion', tips: ['Natural wrist movement'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Machine Chest Press', rating: 'Recommended', target: 'Beginner friendly', tips: ['Constant tension', 'Easy progressive overload'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Cable Chest Fly', rating: 'Recommended', target: 'Chest isolation', tips: ['Keep slight elbow bend', 'Hugging motion', 'Squeeze chest at the end'], videoPlaceholder: '/animations/cable_lying_fly.mp4' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Dumbbell Fly', rating: 'Optional', target: 'Deep stretch', tips: ['Don\'t go too heavy'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Push-ups', rating: 'Recommended', target: 'Excellent bodyweight movement', tips: ['Keep body straight', 'Chest touches floor'], videoPlaceholder: '/gifs/0001.gif' },

  // Lower Chest
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Decline Barbell Bench Press', rating: 'Recommended', target: 'Targets lower chest', tips: ['Decline bench about 15–30°'], videoPlaceholder: '/animations/barbell_decline_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Decline Dumbbell Press', rating: 'Recommended', target: 'Better stretch than barbell', tips: ['Full range of motion'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Chest Dips', rating: 'Essential', target: 'Lower chest and triceps', tips: ['Lean torso forward', 'Elbows flare slightly', 'Descend until shoulders are comfortable'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'High-to-Low Cable Fly', rating: 'Essential', target: 'Lower chest isolation', tips: ['Handles start above shoulders', 'Bring hands downward toward hips', 'Squeeze at the bottom'], videoPlaceholder: '/animations/high_fly.mp4' },

  // 🪽 Lat (Back Width) Exercises
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Pull-Ups', rating: 'Essential', target: 'Best bodyweight exercise for lats', tips: ['Grip slightly wider than shoulders', 'Pull chest toward the bar'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Chin-Ups', rating: 'Recommended', target: 'More biceps involvement', tips: ['Underhand grip', 'Great for beginners'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Wide-Grip Lat Pulldown', rating: 'Essential', target: 'Lats', tips: ['Pull bar to upper chest', 'Don\'t lean back excessively', 'Focus on pulling with elbows'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Close-Grip Lat Pulldown', rating: 'Recommended', target: 'Strong lower lat activation', tips: ['Neutral or V-grip', 'Greater range of motion'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Straight-Arm Cable Pulldown', rating: 'Recommended', target: 'Excellent isolation for lats', tips: ['Arms nearly straight', 'Pull bar toward thighs'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Single-Arm Lat Pulldown', rating: 'Recommended', target: 'Better mind-muscle connection', tips: ['Helps fix muscle imbalances'], videoPlaceholder: '/gifs/0007.gif' },

  // 🧱 Mid Back (Thickness) Exercises
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Barbell Bent-Over Row', rating: 'Essential', target: 'Back Thickness', tips: ['Keep back flat', 'Pull bar to lower chest/upper abdomen', 'Squeeze shoulder blades together'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Pendlay Row', rating: 'Recommended', target: 'Builds strength and thickness', tips: ['Bar starts from the floor each rep', 'Explosive pull'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Seated Cable Row', rating: 'Essential', target: 'Mid Back', tips: ['Pull handle to lower ribs', 'Keep chest up', 'Don\'t use momentum'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Chest-Supported Row', rating: 'Essential', target: 'Great for strict form', tips: ['Removes lower back involvement'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'T-Bar Row', rating: 'Essential', target: 'Excellent for back thickness', tips: ['Pull toward chest'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'One-Arm Dumbbell Row', rating: 'Essential', target: 'Mid Back', tips: ['Stretch fully at the bottom', 'Pull elbow close to the body'], videoPlaceholder: '/gifs/0007.gif' },

  // ⛰️ Upper Back Exercises
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Face Pulls', rating: 'Essential', target: 'Great for traps and rear delts', tips: ['Pull rope toward face', 'Elbows high'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Rear Delt Fly', rating: 'Recommended', target: 'Rear Delts', tips: ['Slight bend in elbows', 'Lift outward, not backward'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Wide-Grip Seated Cable Row', rating: 'Recommended', target: 'Targets upper back more than lats', tips: ['Elbows flare outward'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'High Row Machine', rating: 'Recommended', target: 'Upper Back', tips: ['Pull toward upper chest', 'Strong contraction at the top'], videoPlaceholder: '/gifs/0010.gif' },
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Shrugs', rating: 'Essential', target: 'Traps', tips: ['Lift shoulders straight up', 'Pause at the top', 'Don\'t roll shoulders'], videoPlaceholder: '/gifs/0013.gif' },

  // 🔻 Lower Back Exercises
  { group: 'Back', subGroup: '🔻 Lower Back Exercises', name: 'Deadlift', rating: 'Essential', target: 'Best overall posterior chain exercise', tips: ['Keep neutral spine', 'Drive through legs'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Back', subGroup: '🔻 Lower Back Exercises', name: 'Romanian Deadlift (RDL)', rating: 'Recommended', target: 'Focus on hamstrings and lower back', tips: ['Push hips back', 'Slight knee bend'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Back', subGroup: '🔻 Lower Back Exercises', name: 'Back Extensions (Hyperextensions)', rating: 'Recommended', target: 'Lower Back', tips: ['Controlled movement', 'Avoid overextending at the top'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Back', subGroup: '🔻 Lower Back Exercises', name: 'Good Mornings', rating: 'Optional', target: 'Lower Back, Hamstrings', tips: ['Light to moderate weight', 'Hinge at hips', 'Keep back straight'], videoPlaceholder: '/gifs/0011.gif' },

  // 🦵 Quadriceps Exercises
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Barbell Back Squat', rating: 'Essential', target: 'Best overall quad builder', tips: ['Feet shoulder-width apart', 'Squat until thighs are at least parallel', 'Drive through your whole foot'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Front Squat', rating: 'Essential', target: 'More quad-focused than back squats', tips: ['Bar rests on front shoulders', 'Keep torso upright'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Leg Press', rating: 'Essential', target: 'Quads', tips: ['Feet shoulder-width on the platform', 'Lower until knees reach about 90°', 'Don\'t lock knees at the top'], videoPlaceholder: '/gifs/0013.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Bulgarian Split Squat', rating: 'Recommended', target: 'Great for quads and balance', tips: ['Rear foot elevated', 'Front knee tracks over toes'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Walking Lunges', rating: 'Recommended', target: 'Quads', tips: ['Take long, controlled steps', 'Push through the front heel'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Leg Extension', rating: 'Recommended', target: 'Isolate the quads', tips: ['Pause at full extension', 'Lower slowly'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Legs', subGroup: '🦵 Quadriceps Exercises', name: 'Hack Squat', rating: 'Essential', target: 'Excellent for quad growth', tips: ['Keep back against the pad', 'Feet slightly forward'], videoPlaceholder: '/gifs/0006.gif' },

  // 🍗 Hamstring Exercises
  { group: 'Legs', subGroup: '🍗 Hamstring Exercises', name: 'Romanian Deadlift (RDL)', rating: 'Essential', target: 'Hamstrings', tips: ['Slight knee bend', 'Push hips back', 'Feel the stretch in hamstrings'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Legs', subGroup: '🍗 Hamstring Exercises', name: 'Lying Leg Curl', rating: 'Essential', target: 'Hamstrings', tips: ['Curl slowly', 'Squeeze at the top', 'Lower under control'], videoPlaceholder: '/gifs/0013.gif' },
  { group: 'Legs', subGroup: '🍗 Hamstring Exercises', name: 'Seated Leg Curl', rating: 'Essential', target: 'Excellent hamstring isolation', tips: ['Full range of motion'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Legs', subGroup: '🍗 Hamstring Exercises', name: 'Good Mornings', rating: 'Recommended', target: 'Hamstrings', tips: ['Light to moderate weight', 'Hip hinge movement', 'Keep back neutral'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Legs', subGroup: '🍗 Hamstring Exercises', name: 'Nordic Hamstring Curl', rating: 'Essential', target: 'Excellent for strength and injury prevention', tips: ['Control the lowering phase', 'Extremely challenging'], videoPlaceholder: '/gifs/0009.gif' },

  // 🍑 Glute Exercises
  { group: 'Legs', subGroup: '🍑 Glute Exercises', name: 'Barbell Hip Thrust', rating: 'Essential', target: 'Glutes', tips: ['Upper back on a bench', 'Drive hips upward', 'Squeeze glutes at the top'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Legs', subGroup: '🍑 Glute Exercises', name: 'Glute Bridge', rating: 'Recommended', target: 'Glutes', tips: ['Similar to hip thrust', 'Shorter range of motion'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Legs', subGroup: '🍑 Glute Exercises', name: 'Cable Kickbacks', rating: 'Recommended', target: 'Glutes', tips: ['Kick leg backward', 'Keep hips square', 'Squeeze glutes'], videoPlaceholder: '/gifs/0013.gif' },
  { group: 'Legs', subGroup: '🍑 Glute Exercises', name: 'Step-Ups', rating: 'Recommended', target: 'Glutes', tips: ['Step onto a bench', 'Drive through the front heel'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Legs', subGroup: '🍑 Glute Exercises', name: 'Sumo Deadlift', rating: 'Essential', target: 'Strong glute and adductor activation', tips: ['Wide stance', 'Toes pointed out'], videoPlaceholder: '/gifs/0002.gif' },

  // 🦶 Calf Exercises
  { group: 'Legs', subGroup: '🦶 Calf Exercises', name: 'Standing Calf Raise', rating: 'Essential', target: 'Targets the gastrocnemius', tips: ['Full stretch at the bottom', 'Pause at the top'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Legs', subGroup: '🦶 Calf Exercises', name: 'Seated Calf Raise', rating: 'Essential', target: 'Targets the soleus', tips: ['Controlled movement', 'High reps work well'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Legs', subGroup: '🦶 Calf Exercises', name: 'Leg Press Calf Raise', rating: 'Recommended', target: 'Calves', tips: ['Perform calf raises on the leg press', 'Full range of motion'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Legs', subGroup: '🦶 Calf Exercises', name: 'Single-Leg Calf Raise', rating: 'Recommended', target: 'Calves', tips: ['Improves balance', 'Helps fix strength imbalances'], videoPlaceholder: '/gifs/0013.gif' },

  // ⚖️ Adductor (Inner Thigh) Exercises
  { group: 'Legs', subGroup: '⚖️ Adductor (Inner Thigh) Exercises', name: 'Adductor Machine', rating: 'Essential', target: 'Adductors', tips: ['Controlled squeeze', 'Full range of motion'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Legs', subGroup: '⚖️ Adductor (Inner Thigh) Exercises', name: 'Sumo Squat', rating: 'Recommended', target: 'Adductors, Quads', tips: ['Wide stance', 'Toes pointed outward', 'Descend until thighs are parallel'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Legs', subGroup: '⚖️ Adductor (Inner Thigh) Exercises', name: 'Cossack Squat', rating: 'Recommended', target: 'Excellent mobility and strength', tips: ['Shift weight to one side', 'Keep opposite leg straight'], videoPlaceholder: '/gifs/0012.gif' },

  // Other Muscles
  // 🔵 Front (Anterior) Delt Exercises
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Overhead Barbell Press', rating: 'Essential', target: 'Front Delts', tips: ['Press bar overhead in a straight path', 'Keep core tight'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Seated Dumbbell Shoulder Press', rating: 'Essential', target: 'Front Delts', tips: ['Keep elbows slightly in front of shoulders', 'Don\'t lock elbows aggressively'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Arnold Press', rating: 'Recommended', target: 'Front Delts', tips: ['Rotate palms during the press', 'Trains front delts through a longer range'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Dumbbell Front Raise', rating: 'Recommended', target: 'Front Delts', tips: ['Raise dumbbells to shoulder height', 'Control the lowering phase', 'Avoid swinging'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Barbell Front Raise', rating: 'Optional', target: 'Front Delts', tips: ['Similar to dumbbell version', 'Good for heavier loading'], videoPlaceholder: '/gifs/0011.gif' },

  // 🟢 Side (Lateral) Delt Exercises
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Dumbbell Lateral Raise', rating: 'Essential', target: 'Side Delts', tips: ['Raise arms to shoulder level', 'Slight bend in elbows', 'Lead with elbows, not hands'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Cable Lateral Raise', rating: 'Essential', target: 'Side Delts', tips: ['Constant tension throughout the movement', 'One arm at a time works well'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Machine Lateral Raise', rating: 'Recommended', target: 'Side Delts', tips: ['Easy to isolate the side delts', 'Controlled movement'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Leaning Cable Lateral Raise', rating: 'Recommended', target: 'Side Delts', tips: ['Lean away from the cable', 'Increases stretch at the bottom'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Upright Row (Wide Grip)', rating: 'Optional', target: 'Side Delts', tips: ['Pull bar to upper chest', 'Use a wide grip to emphasize side delts', 'Avoid excessive weight if it causes shoulder discomfort'], videoPlaceholder: '/gifs/0013.gif' },

  // 🔴 Rear (Posterior) Delt Exercises
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Reverse Pec Deck Fly', rating: 'Essential', target: 'Rear Delts', tips: ['Keep chest against the pad', 'Pull with elbows', 'Squeeze at the end'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Face Pull', rating: 'Essential', target: 'Rear Delts, Traps', tips: ['Pull rope toward forehead', 'Elbows high'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Bent-Over Dumbbell Reverse Fly', rating: 'Essential', target: 'Rear Delts', tips: ['Hinge at the hips', 'Raise arms outward', 'Don\'t shrug'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Cable Rear Delt Fly', rating: 'Recommended', target: 'Rear Delts', tips: ['Cross cables if available', 'Slow and controlled reps'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Rear Delt Row', rating: 'Recommended', target: 'Rear Delts', tips: ['Pull elbows out wide', 'Focus on the rear delts rather than lats'], videoPlaceholder: '/gifs/0007.gif' },

  // 🏔️ Traps (Optional)
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Barbell Shrugs', rating: 'Essential', target: 'Traps', tips: ['Lift shoulders straight up', 'Pause at the top', 'Don\'t roll shoulders'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Dumbbell Shrugs', rating: 'Recommended', target: 'Traps', tips: ['Full range of motion', 'Controlled lowering'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Farmer\'s Walk', rating: 'Recommended', target: 'Traps, Grip', tips: ['Hold heavy dumbbells', 'Walk with upright posture'], videoPlaceholder: '/gifs/0006.gif' },
  // 🔵 Long Head Exercises (Biceps Peak)
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Incline Dumbbell Curl', rating: 'Essential', target: 'Long Head', tips: ['Sit on a 45–60° incline bench', 'Let arms hang fully', 'Curl without moving your shoulders'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Close-Grip Barbell Curl', rating: 'Essential', target: 'Long Head', tips: ['Grip narrower than shoulder width', 'Keep elbows tucked', 'Curl in a controlled manner'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Drag Curl', rating: 'Recommended', target: 'Long Head', tips: ['Keep the bar close to your body', 'Pull elbows backward as you curl', 'Focus on squeezing the biceps'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Bayesian Cable Curl', rating: 'Recommended', target: 'Long Head', tips: ['Stand facing away from the cable', 'Arm starts behind the body', 'Great stretch on the long head'], videoPlaceholder: '/gifs/0011.gif' },

  // 🟢 Short Head Exercises (Width)
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'EZ-Bar Curl', rating: 'Essential', target: 'Short Head', tips: ['Comfortable wrist position', 'Keep elbows fixed', 'Full range of motion'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Wide-Grip Barbell Curl', rating: 'Essential', target: 'Short Head', tips: ['Grip wider than shoulder width', 'Emphasizes the short head'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Preacher Curl', rating: 'Essential', target: 'Short Head', tips: ['Arms supported on the pad', 'Strict movement', 'Excellent isolation'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Spider Curl', rating: 'Recommended', target: 'Short Head', tips: ['Chest supported on an incline bench', 'Arms hang straight down', 'No momentum'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Concentration Curl', rating: 'Recommended', target: 'Short Head', tips: ['Elbow against inner thigh', 'Slow squeeze at the top'], videoPlaceholder: '/gifs/0007.gif' },

  // 🟠 Brachialis Exercises
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Hammer Curl', rating: 'Essential', target: 'Brachialis', tips: ['Neutral (thumbs-up) grip', 'Keep elbows close', 'Excellent overall arm builder'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Cross-Body Hammer Curl', rating: 'Essential', target: 'Brachialis', tips: ['Curl toward the opposite shoulder', 'Strong brachialis emphasis'], videoPlaceholder: '/gifs/0010.gif' },
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Reverse EZ-Bar Curl', rating: 'Recommended', target: 'Brachialis, Forearms', tips: ['Overhand grip', 'Builds brachialis and forearms'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Reverse Cable Curl', rating: 'Recommended', target: 'Brachialis', tips: ['Constant tension', 'Controlled movement'], videoPlaceholder: '/gifs/0006.gif' },

  // 🔹 Long Head Exercises
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Overhead Dumbbell Triceps Extension', rating: 'Essential', target: 'Long Head', tips: ['Hold one dumbbell with both hands', 'Lower behind your head', 'Keep elbows close to your ears'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Overhead Cable Triceps Extension', rating: 'Essential', target: 'Long Head', tips: ['Use rope attachment', 'Step forward slightly', 'Fully stretch at the bottom'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'EZ-Bar Skull Crushers', rating: 'Recommended', target: 'Long Head', tips: ['Lower bar behind forehead or slightly behind head', 'Keep upper arms fixed', 'Extend without flaring elbows'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Incline Dumbbell Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Lie on an incline bench', 'Lower dumbbells behind your head', 'Excellent stretch on the long head'], videoPlaceholder: '/gifs/0009.gif' },

  // 🔸 Lateral Head Exercises
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Rope Triceps Pushdown', rating: 'Essential', target: 'Lateral Head', tips: ['Keep elbows pinned to your sides', 'Spread the rope apart at the bottom', 'Squeeze hard'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Straight-Bar Pushdown', rating: 'Essential', target: 'Lateral Head', tips: ['Use an overhand grip', 'Push straight down', 'Don\'t swing your body'], videoPlaceholder: '/gifs/0013.gif' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Close-Grip Bench Press', rating: 'Essential', target: 'Lateral Head, Chest', tips: ['Grip slightly narrower than shoulder width', 'Keep elbows close', 'Press explosively'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Bench Dips', rating: 'Recommended', target: 'Lateral Head', tips: ['Hands on a bench behind you', 'Lower until elbows reach about 90°', 'Push back up'], videoPlaceholder: '/gifs/0002.gif' },

  // ⚪ Medial Head Exercises
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Reverse-Grip Cable Pushdown', rating: 'Essential', target: 'Medial Head', tips: ['Underhand grip', 'Keep elbows tucked', 'Slow, controlled reps'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Diamond Push-Ups', rating: 'Recommended', target: 'Medial Head, Chest', tips: ['Hands form a diamond shape', 'Keep elbows close', 'Lower chest between hands'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Single-Arm Reverse Pushdown', rating: 'Recommended', target: 'Medial Head', tips: ['Underhand grip', 'Focus on full extension', 'Great for correcting imbalances'], videoPlaceholder: '/gifs/0013.gif' },

  // ⬜ Upper Abs Exercises
  { group: 'Core', subGroup: '⬜ Upper Abs Exercises', name: 'Cable Crunch', rating: 'Essential', target: 'Upper Abs', tips: ['Kneel in front of a cable', 'Curl your spine downward', 'Don\'t pull with your arms'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Core', subGroup: '⬜ Upper Abs Exercises', name: 'Machine Crunch', rating: 'Essential', target: 'Upper Abs', tips: ['Keep lower back against the pad', 'Exhale as you crunch', 'Slow, controlled reps'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Core', subGroup: '⬜ Upper Abs Exercises', name: 'Stability Ball Crunch', rating: 'Recommended', target: 'Upper Abs', tips: ['Lie on a stability ball', 'Crunch while keeping hips stable', 'Full range of motion'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Core', subGroup: '⬜ Upper Abs Exercises', name: 'Weighted Crunch', rating: 'Recommended', target: 'Upper Abs', tips: ['Hold a plate on your chest', 'Curl your upper body', 'Don\'t pull your neck'], videoPlaceholder: '/gifs/0009.gif' },

  // 🔲 Lower Abs Exercises
  { group: 'Core', subGroup: '🔲 Lower Abs Exercises', name: 'Hanging Leg Raise', rating: 'Essential', target: 'Lower Abs', tips: ['Hang from a pull-up bar', 'Raise legs without swinging', 'Tilt pelvis upward at the top'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Core', subGroup: '🔲 Lower Abs Exercises', name: 'Hanging Knee Raise', rating: 'Essential', target: 'Lower Abs', tips: ['Bend knees if full leg raises are difficult', 'Focus on curling the hips upward'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Core', subGroup: '🔲 Lower Abs Exercises', name: 'Reverse Crunch', rating: 'Essential', target: 'Lower Abs', tips: ['Lie on your back', 'Bring knees toward your chest', 'Lift hips off the floor'], videoPlaceholder: '/gifs/0006.gif' },
  { group: 'Core', subGroup: '🔲 Lower Abs Exercises', name: 'Lying Leg Raise', rating: 'Recommended', target: 'Lower Abs', tips: ['Keep lower back pressed into the floor', 'Lower legs slowly', 'Avoid arching your back'], videoPlaceholder: '/gifs/0013.gif' },

  // 🔄 Oblique Exercises
  { group: 'Core', subGroup: '🔄 Oblique Exercises', name: 'Cable Wood Chop', rating: 'Essential', target: 'Obliques', tips: ['Rotate your torso', 'Keep hips stable', 'Control both directions'], videoPlaceholder: '/gifs/0009.gif' },
  { group: 'Core', subGroup: '🔄 Oblique Exercises', name: 'Russian Twist', rating: 'Recommended', target: 'Obliques', tips: ['Lean back slightly', 'Rotate through the torso', 'Add weight as you progress'], videoPlaceholder: '/gifs/0011.gif' },
  { group: 'Core', subGroup: '🔄 Oblique Exercises', name: 'Side Plank', rating: 'Essential', target: 'Obliques', tips: ['Keep body in a straight line', 'Hold the position', 'Don\'t let hips sag'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Core', subGroup: '🔄 Oblique Exercises', name: 'Bicycle Crunch', rating: 'Recommended', target: 'Obliques', tips: ['Bring opposite elbow to opposite knee', 'Slow and controlled movement'], videoPlaceholder: '/gifs/0003.gif' },

  // 🛡️ Transverse Abdominis (Deep Core)
  { group: 'Core', subGroup: '🛡️ Transverse Abdominis (Deep Core)', name: 'Plank', rating: 'Essential', target: 'Deep Core', tips: ['Elbows under shoulders', 'Body in a straight line', 'Brace your core'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Core', subGroup: '🛡️ Transverse Abdominis (Deep Core)', name: 'Dead Bug', rating: 'Essential', target: 'Deep Core', tips: ['Lower opposite arm and leg', 'Keep lower back on the floor', 'Move slowly'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Core', subGroup: '🛡️ Transverse Abdominis (Deep Core)', name: 'Hollow Body Hold', rating: 'Essential', target: 'Deep Core', tips: ['Press lower back into the floor', 'Lift shoulders and legs slightly', 'Maintain tension'], videoPlaceholder: '/gifs/0007.gif' },
  { group: 'Core', subGroup: '🛡️ Transverse Abdominis (Deep Core)', name: 'Ab Wheel Rollout', rating: 'Essential', target: 'Deep Core', tips: ['Roll forward slowly', 'Don\'t let hips sag', 'Pull back using your core'], videoPlaceholder: '/gifs/0006.gif' },

  // 🧱 Lower Back Exercises
  { group: 'Core', subGroup: '🧱 Lower Back Exercises', name: 'Back Extension', rating: 'Essential', target: 'Lower Back', tips: ['Controlled movement', 'Stop at neutral spine', 'Don\'t overextend'], videoPlaceholder: '/gifs/0002.gif' },
  { group: 'Core', subGroup: '🧱 Lower Back Exercises', name: 'Superman', rating: 'Recommended', target: 'Lower Back', tips: ['Lift arms and legs together', 'Hold briefly', 'Lower slowly'], videoPlaceholder: '/gifs/0001.gif' },
  { group: 'Core', subGroup: '🧱 Lower Back Exercises', name: 'Bird Dog', rating: 'Essential', target: 'Lower Back', tips: ['Extend opposite arm and leg', 'Keep hips level', 'Focus on stability'], videoPlaceholder: '/gifs/0003.gif' },
  { group: 'Core', subGroup: '🧱 Lower Back Exercises', name: 'Good Morning', rating: 'Recommended', target: 'Lower Back', tips: ['Hip hinge movement', 'Keep back straight', 'Use light to moderate weight'], videoPlaceholder: '/gifs/0011.gif' }
];

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core'];

export function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState(MUSCLE_GROUPS[0]);
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => ex.group === selectedGroup);

  // Group the filtered exercises by their subGroup and limit 'Essential' to max 2 per group
  const groupedExercises = filteredExercises.reduce((acc, ex) => {
    if (!acc[ex.subGroup]) {
      acc[ex.subGroup] = { items: [], essentialCount: 0 };
    }
    
    // Create a copy to safely mutate the rating for display
    const processedEx = { ...ex };
    
    if (processedEx.rating === 'Essential') {
      if (acc[ex.subGroup].essentialCount < 2) {
        acc[ex.subGroup].essentialCount++;
      } else {
        processedEx.rating = 'Recommended'; // Downgrade to Recommended if limit reached
      }
    }
    
    acc[ex.subGroup].items.push(processedEx);
    return acc;
  }, {} as Record<string, { items: typeof EXERCISE_LIBRARY, essentialCount: number }>);

  return (
    <div className="dashboard-layout">
      {/* Filters & Header */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 className="section-title" style={{ margin: 0, paddingBottom: 0, border: 'none' }}>Exercise Library</h2>
        <p className="page-subtitle" style={{ margin: 0 }}>Select a muscle group to view the optimal form, target regions, and ratings.</p>
        
        <div style={{ maxWidth: '300px' }}>
          <select 
            className="form-control" 
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>{group} Exercises</option>
            ))}
          </select>
        </div>
      </div>

      {/* Render each sub-group as a section */}
      {Object.entries(groupedExercises).map(([subGroup, data]) => (
        <div key={subGroup} style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            {subGroup}
          </h2>
          
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {data.items.map((ex, index) => (
              <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                
                {/* Video Player Header */}
                <div 
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    backgroundColor: 'var(--bg-page)',
                    backgroundImage: ex.videoPlaceholder.endsWith('.mp4') ? 'none' : `url(${ex.videoPlaceholder})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  {ex.videoPlaceholder.endsWith('.mp4') ? (
                    <video 
                      src={ex.videoPlaceholder} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      border: '2px solid rgba(255,255,255,0.8)',
                      cursor: 'pointer',
                    }}>
                      ▶
                    </div>
                  )}
                </div>

                {/* Exercise Details */}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 600 }}>{ex.name}</h3>
                  </div>
                  
                  <div style={{ marginBottom: '12px', display: 'inline-block' }}>
                    <span className="badge" style={{ 
                      backgroundColor: ex.rating === 'Essential' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      color: ex.rating === 'Essential' ? '#10b981' : 'var(--text-secondary)',
                      border: `1px solid ${ex.rating === 'Essential' ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'}`
                    }}>
                      {ex.rating === 'Essential' ? '✨ Essential' : (ex.rating === 'Recommended' ? 'Highly Recommended' : 'Optional')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <span className="badge" style={{ margin: 0 }}>{ex.target}</span>
                  </div>
                  
                  <ul style={{ 
                    paddingLeft: '20px', 
                    margin: 0, 
                    color: 'var(--text-secondary)', 
                    fontSize: '0.875rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '8px' 
                  }}>
                    {ex.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
