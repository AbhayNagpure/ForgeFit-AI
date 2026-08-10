import React, { useState } from 'react';

const EXERCISE_LIBRARY = [
  // Upper Chest
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Barbell Incline Bench Press', rating: 'Essential', target: 'Best for overall upper chest mass', tips: ['Bench angle: 30–45°', 'Elbows about 45–60° from your body', 'Lower bar to upper chest'], videoPlaceholder: '/animations/barbell_incline_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Upper Chest', name: 'Cable Standing Fly (Crossover Fly)', rating: 'Recommended', target: 'Upper chest isolation', tips: ['Start handles near hips', 'Bring hands upward toward eye level'], videoPlaceholder: '/animations/cable_standing_fly.mp4' },
  
  // Middle Chest
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Barbell Bench Press', rating: 'Essential', target: 'King of chest exercises', tips: ['Feet planted', 'Shoulder blades retracted', 'Lower to mid chest'], videoPlaceholder: '/animations/barbell_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Cable Lying Fly', rating: 'Recommended', target: 'Chest isolation', tips: ['Keep slight elbow bend', 'Hugging motion', 'Squeeze chest at the end'], videoPlaceholder: '/animations/cable_lying_fly.mp4' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Deep Push-Ups', rating: 'Recommended', target: 'Excellent bodyweight movement', tips: ['Keep body straight', 'Chest touches floor'], videoPlaceholder: '/animations/deep_push_ups.mp4' },
  { group: 'Chest', subGroup: 'Middle Chest', name: 'Lever Pec Deck Fly', rating: 'Essential', target: 'Chest isolation', tips: ['Squeeze at the center'], videoPlaceholder: '/animations/lever_pec_deck_fly.mp4' },

  // Lower Chest
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Barbell Decline Bench Press', rating: 'Recommended', target: 'Targets lower chest', tips: ['Decline bench about 15–30°'], videoPlaceholder: '/animations/barbell_decline_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Decline Dumbbell Bench Press', rating: 'Recommended', target: 'Better stretch than barbell', tips: ['Full range of motion'], videoPlaceholder: '/animations/decline_dumbbell_bench_press.mp4' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Chest Dips', rating: 'Essential', target: 'Lower chest and triceps', tips: ['Lean torso forward', 'Elbows flare slightly', 'Descend until shoulders are comfortable'], videoPlaceholder: '/animations/chest_dips.mp4' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'High Fly', rating: 'Essential', target: 'Lower chest isolation', tips: ['Handles start above shoulders', 'Bring hands downward toward hips', 'Squeeze at the bottom'], videoPlaceholder: '/animations/high_fly.mp4' },
  { group: 'Chest', subGroup: 'Lower Chest', name: 'Dumbbell Decline Fly', rating: 'Optional', target: 'Lower chest', tips: ['Decline bench 45 degrees'], videoPlaceholder: '/animations/dumbbell_decline_fly.mp4' },

  // 🪽 Lat (Back Width) Exercises
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Chin-Ups & Pull-Ups', rating: 'Essential', target: 'Best bodyweight exercise for lats', tips: ['Grip slightly wider than shoulders', 'Pull chest toward the bar'], videoPlaceholder: '/animations/chin_ups_and_pull_ups.mp4' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Band Assisted Pull-Up', rating: 'Recommended', target: 'Lats', tips: ['Use a band for assistance'], videoPlaceholder: '/animations/band_assisted_pull_up.mp4' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Cable Pulldown', rating: 'Essential', target: 'Lats', tips: ['Pull bar to upper chest', 'Don\'t lean back excessively', 'Focus on pulling with elbows'], videoPlaceholder: '/animations/cable_pulldown.mp4' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Cable Close Grip Front Lat Pulldown', rating: 'Recommended', target: 'Strong lower lat activation', tips: ['Neutral or V-grip', 'Greater range of motion'], videoPlaceholder: '/animations/cable_close_grip_front_lat_pulldown.mp4' },
  { group: 'Back', subGroup: '🪽 Lat (Back Width) Exercises', name: 'Band Kneeling One Arm Pulldown', rating: 'Recommended', target: 'Excellent isolation for lats', tips: ['Arms nearly straight'], videoPlaceholder: '/animations/band_kneeling_one_arm_pulldown.mp4' },

  // 🧱 Mid Back (Thickness) Exercises
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Barbell Bent-Over Row', rating: 'Essential', target: 'Back Thickness', tips: ['Keep back flat', 'Pull bar to lower chest/upper abdomen', 'Squeeze shoulder blades together'], videoPlaceholder: '/animations/barbell_bent_over_row.mp4' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Band Seated Row', rating: 'Essential', target: 'Mid Back', tips: ['Pull handle to lower ribs', 'Keep chest up', 'Don\'t use momentum'], videoPlaceholder: '/animations/band_seated_row.mp4' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Band One Arm Twisting Seated Row', rating: 'Recommended', target: 'Mid Back isolation', tips: ['Twist at the end'], videoPlaceholder: '/animations/band_one_arm_twisting_seated_row.mp4' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Dumbbell Hammer Grip Incline Bench Row', rating: 'Essential', target: 'Great for strict form', tips: ['Removes lower back involvement'], videoPlaceholder: '/animations/dumbbell_hammer_grip_incline_bench_row.mp4' },
  { group: 'Back', subGroup: '🧱 Mid Back (Thickness) Exercises', name: 'Dumbbell Bent-Over Row', rating: 'Essential', target: 'Mid Back', tips: ['Stretch fully at the bottom', 'Pull elbow close to the body'], videoPlaceholder: '/animations/dumbbell_bent_over_row.mp4' },

  // ⛰️ Upper Back Exercises
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Lever Seated Reverse Fly', rating: 'Recommended', target: 'Rear Delts', tips: ['Slight bend in elbows', 'Lift outward, not backward'], videoPlaceholder: '/animations/lever_seated_reverse_fly.mp4' },
  { group: 'Back', subGroup: '⛰️ Upper Back Exercises', name: 'Cable Rear Delt Row (Rope)', rating: 'Recommended', target: 'Rear Delts', tips: ['Pull towards face'], videoPlaceholder: '/animations/cable_rear_delt_row.mp4' },

  // 🔻 Lower Back Exercises
  { group: 'Back', subGroup: '🔻 Lower Back Exercises', name: '45 Degree Hyperextension', rating: 'Recommended', target: 'Lower Back', tips: ['Controlled movement', 'Avoid overextending at the top'], videoPlaceholder: '/animations/45_degree_hyperextension.mp4' },

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
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Military Press', rating: 'Essential', target: 'Front Delts', tips: ['Keep core tight'], videoPlaceholder: '/animations/military_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Lever Military Press', rating: 'Recommended', target: 'Front Delts', tips: ['Machine press'], videoPlaceholder: '/animations/lever_military_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Smith Seated Shoulder Press', rating: 'Recommended', target: 'Front Delts', tips: ['Controlled pressing'], videoPlaceholder: '/animations/smith_seated_shoulder_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Dumbbell Bench Seated Press', rating: 'Essential', target: 'Front Delts', tips: ['Keep elbows slightly in front of shoulders'], videoPlaceholder: '/animations/dumbbell_bench_seated_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Dumbbell Alternate Shoulder Press', rating: 'Recommended', target: 'Front Delts', tips: ['One arm at a time'], videoPlaceholder: '/animations/dumbbell_alternate_shoulder_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Dumbbell Arnold Press', rating: 'Recommended', target: 'Front Delts', tips: ['Rotate palms during the press', 'Trains front delts through a longer range'], videoPlaceholder: '/animations/dumbbell_arnold_press.mp4' },
  { group: 'Shoulders', subGroup: '🔵 Front (Anterior) Delt Exercises', name: 'Barbell Front Raise', rating: 'Recommended', target: 'Front Delts', tips: ['Good for heavier loading'], videoPlaceholder: '/animations/barbell_front_raise.mp4' },

  // 🟢 Side (Lateral) Delt Exercises
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Dumbbell Lateral Raise', rating: 'Essential', target: 'Side Delts', tips: ['Raise arms to shoulder level', 'Slight bend in elbows', 'Lead with elbows, not hands'], videoPlaceholder: '/animations/dumbbell_lateral_raise.mp4' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Dumbbell One Arm Lateral Raise', rating: 'Recommended', target: 'Side Delts', tips: ['Focus on one side'], videoPlaceholder: '/animations/dumbbell_one_arm_lateral_raise.mp4' },
  { group: 'Shoulders', subGroup: '🟢 Side (Lateral) Delt Exercises', name: 'Barbell Upright Row (Wide Grip)', rating: 'Recommended', target: 'Side Delts', tips: ['Pull bar to upper chest', 'Use a wide grip to emphasize side delts'], videoPlaceholder: '/animations/barbell_upright_row_wide_grip.mp4' },

  // 🔴 Rear (Posterior) Delt Exercises
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Lever Seated Reverse Fly', rating: 'Essential', target: 'Rear Delts', tips: ['Keep chest against the pad', 'Pull with elbows', 'Squeeze at the end'], videoPlaceholder: '/animations/shoulder_lever_seated_reverse_fly.mp4' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Dumbbell Rear Lateral Raise', rating: 'Essential', target: 'Rear Delts', tips: ['Hinge at the hips', 'Raise arms outward', 'Don\'t shrug'], videoPlaceholder: '/animations/dumbbell_rear_lateral_raise.mp4' },
  { group: 'Shoulders', subGroup: '🔴 Rear (Posterior) Delt Exercises', name: 'Cable Rear Delt Row (Rope)', rating: 'Recommended', target: 'Rear Delts', tips: ['Pull elbows out wide', 'Focus on the rear delts rather than lats'], videoPlaceholder: '/animations/shoulder_cable_rear_delt_row.mp4' },

  // 🏔️ Traps (Optional)
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Barbell Shrug', rating: 'Essential', target: 'Traps', tips: ['Lift shoulders straight up', 'Pause at the top', 'Don\'t roll shoulders'], videoPlaceholder: '/animations/barbell_shrug.mp4' },
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Dumbbell Shrug', rating: 'Recommended', target: 'Traps', tips: ['Full range of motion', 'Controlled lowering'], videoPlaceholder: '/animations/dumbbell_shrug.mp4' },
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Dumbbell Incline Shrug', rating: 'Recommended', target: 'Traps', tips: ['Lean on an incline bench', 'Squeeze traps'], videoPlaceholder: '/animations/dumbbell_incline_shrug.mp4' },
  { group: 'Shoulders', subGroup: '🏔️ Traps (Optional)', name: 'Neck Side Stretch', rating: 'Recommended', target: 'Neck', tips: ['Stretch gently'], videoPlaceholder: '/animations/neck_side_stretch.mp4' },
  // 🔵 Long Head Exercises (Biceps Peak)
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Dumbbell Incline Biceps Curl', rating: 'Essential', target: 'Long Head', tips: ['Sit on a 45–60° incline bench', 'Let arms hang fully'], videoPlaceholder: '/animations/dumbbell_incline_biceps_curl.mp4' },
  { group: 'Biceps', subGroup: '🔵 Long Head Exercises (Biceps Peak)', name: 'Barbell Drag Curl', rating: 'Recommended', target: 'Long Head', tips: ['Keep the bar close to your body', 'Pull elbows backward as you curl'], videoPlaceholder: '/animations/barbell_drag_curl.mp4' },

  // 🟢 Short Head Exercises (Width)
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Barbell Curl', rating: 'Essential', target: 'Short Head', tips: ['Full range of motion'], videoPlaceholder: '/animations/barbell_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'EZ Barbell Biceps Curl', rating: 'Essential', target: 'Short Head', tips: ['Comfortable wrist position'], videoPlaceholder: '/animations/ez_barbell_biceps_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Lever Preacher Curl', rating: 'Essential', target: 'Short Head', tips: ['Arms supported on the pad', 'Strict movement'], videoPlaceholder: '/animations/lever_preacher_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Dumbbell Concentration Curl', rating: 'Recommended', target: 'Short Head', tips: ['Elbow against inner thigh', 'Slow squeeze at the top'], videoPlaceholder: '/animations/dumbbell_concentration_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Dumbbell Biceps Curl', rating: 'Recommended', target: 'Short Head', tips: ['Both arms'], videoPlaceholder: '/animations/dumbbell_biceps_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Dumbbell Alternate Seated Biceps Curl', rating: 'Recommended', target: 'Short Head', tips: ['Seated for strict form'], videoPlaceholder: '/animations/dumbbell_alternate_seated_biceps_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Cable One Arm Curl', rating: 'Recommended', target: 'Short Head', tips: ['Constant tension'], videoPlaceholder: '/animations/cable_one_arm_curl.mp4' },
  { group: 'Biceps', subGroup: '🟢 Short Head Exercises (Width)', name: 'Cable Standing Inner Curl', rating: 'Recommended', target: 'Short Head', tips: ['Focus on the inner head'], videoPlaceholder: '/animations/cable_standing_inner_curl.mp4' },

  // 🟠 Brachialis Exercises
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Dumbbell Cross Body Hammer Curl', rating: 'Essential', target: 'Brachialis', tips: ['Curl toward the opposite shoulder'], videoPlaceholder: '/animations/dumbbell_cross_body_hammer_curl.mp4' },
  { group: 'Biceps', subGroup: '🟠 Brachialis Exercises', name: 'Dumbbell One Arm Zottman Preacher Curl', rating: 'Recommended', target: 'Brachialis, Forearms', tips: ['Rotate wrist on the way down'], videoPlaceholder: '/animations/dumbbell_one_arm_zottman_preacher_curl.mp4' },

  // 🔹 Long Head Exercises
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Dumbbell Seated Triceps Extension', rating: 'Essential', target: 'Long Head', tips: ['Hold one dumbbell with both hands', 'Lower behind your head', 'Keep elbows close to your ears'], videoPlaceholder: '/animations/dumbbell_seated_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Cable Standing One Arm Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Use cable'], videoPlaceholder: '/animations/cable_standing_one_arm_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Cable Rope High Pulley Overhead Triceps Extension', rating: 'Essential', target: 'Long Head', tips: ['Use rope attachment', 'Step forward slightly', 'Fully stretch at the bottom'], videoPlaceholder: '/animations/cable_rope_high_pulley_overhead_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Dumbbell Incline Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Lie on an incline bench', 'Lower dumbbells behind your head', 'Excellent stretch on the long head'], videoPlaceholder: '/animations/dumbbell_incline_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Dumbbell Lying Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Lower weight slowly'], videoPlaceholder: '/animations/dumbbell_lying_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Cable Lying Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Constant tension'], videoPlaceholder: '/animations/cable_lying_triceps_extension.mp4' },
  { group: 'Triceps', subGroup: '🔹 Long Head Exercises', name: 'Band Overhead Triceps Extension', rating: 'Recommended', target: 'Long Head', tips: ['Stretch fully at the bottom'], videoPlaceholder: '/animations/band_overhead_triceps_extension.mp4' },

  // 🔸 Lateral Head Exercises
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Cable Triceps Pushdown', rating: 'Essential', target: 'Lateral Head', tips: ['Keep elbows pinned to your sides', 'Spread the rope apart at the bottom', 'Squeeze hard'], videoPlaceholder: '/animations/cable_triceps_pushdown.mp4' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Cable Pushdown (Rope Attachment)', rating: 'Recommended', target: 'Lateral Head', tips: ['Use an overhand grip', 'Push straight down', 'Don\'t swing your body'], videoPlaceholder: '/animations/cable_pushdown_rope_attachment.mp4' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Dumbbell Close Grip Press', rating: 'Essential', target: 'Lateral Head, Chest', tips: ['Grip slightly narrower than shoulder width', 'Keep elbows close', 'Press explosively'], videoPlaceholder: '/animations/dumbbell_close_grip_press.mp4' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Bench Dips', rating: 'Recommended', target: 'Lateral Head', tips: ['Hands on a bench behind you', 'Lower until elbows reach about 90°', 'Push back up'], videoPlaceholder: '/animations/bench_dips.mp4' },
  { group: 'Triceps', subGroup: '🔸 Lateral Head Exercises', name: 'Dumbbell Kickback', rating: 'Recommended', target: 'Lateral Head', tips: ['Keep upper arm parallel to floor'], videoPlaceholder: '/animations/dumbbell_kickback.mp4' },

  // ⚪ Medial Head Exercises
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Reverse-Grip Cable Pushdown', rating: 'Essential', target: 'Medial Head', tips: ['Underhand grip', 'Keep elbows tucked', 'Slow, controlled reps'], videoPlaceholder: '/gifs/0012.gif' },
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Close Grip Push-Ups', rating: 'Recommended', target: 'Medial Head, Chest', tips: ['Hands close together', 'Keep elbows close', 'Lower chest between hands'], videoPlaceholder: '/animations/close_grip_push_ups.mp4' },
  { group: 'Triceps', subGroup: '⚪ Medial Head Exercises', name: 'Dumbbell One Arm Triceps Extension', rating: 'Recommended', target: 'Medial Head', tips: ['Focus on full extension', 'Great for correcting imbalances'], videoPlaceholder: '/animations/dumbbell_one_arm_triceps_extension.mp4' },

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
