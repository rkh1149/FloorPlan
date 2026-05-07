# FloorCraft User Guide

FloorCraft is a home layout app that lets you sketch, arrange, save, and visualize a floor plan in a simple grid workspace.

This guide is written for someone using the app for the first time.

## What You Can Do In FloorCraft

With FloorCraft, you can:

1. Describe a space in plain English and let the app generate a layout for you.
2. Build a plan yourself by placing walls, rooms, doors, windows, furniture, and fixtures on the grid.
3. Move, resize, rename, recolor, and fine-tune individual items.
4. Create complete room kits such as kitchens, bedrooms, bathrooms, lofts, offices, patios, and more.
5. Move an entire room, including walls and everything inside it, as one group.
6. Save a plan and open it again later.
7. Export the visible floor plan as a PNG image.
8. Create a rendered concept image based on the current plan.
9. Open a 3D / dollhouse-style view of the plan.
10. Use the app with a mouse, touch screen, or a device that supports both.

## Main Parts Of The Screen

### Top Bar

The top bar includes:

1. A prompt box where you describe the room or home layout you want.
2. `Generate` to build a floor plan from your text.
3. `Grid` controls to change the size of the overall workspace.
4. `Zoom` to make the plan appear larger or smaller on screen.
5. `Server API` to show whether AI features are available.
6. `Render View` to create a rendered concept image from the current layout.
7. `3D View` to switch to the dollhouse-style overhead view.
8. `Move Room` to move a whole room as one selection.
9. `Save Plan` and `Open Plan`.
10. `Clear` and `Export PNG`.

### Left Panel

The left panel is the artifact library. This is where you choose walls, doors, windows, furniture, fixtures, appliances, and ready-made room kits.

### Center Grid

The center area is the drawing surface. Each grid cell represents 1 foot.

This is where you place and arrange everything.

### Right Panel

The right panel is the Inspector. When you select something on the grid, the Inspector lets you edit its details.

## Quick Start

You can begin in either of these ways.

### Option 1: Generate A Plan From Text

1. Click in the prompt box.
2. Type a description such as `A primary bedroom with an ensuite bathroom and walk-in closet`.
3. Click `Generate`.
4. Wait for the plan to appear centered on the grid.

The generated plan can still be edited afterwards.

### Option 2: Build A Plan Manually

1. Choose an item from the left panel.
2. Drag it onto the grid, or tap/select it and place it on the grid depending on your device.
3. Continue adding walls, rooms, doors, windows, fixtures, and furniture.

## Building A Layout

### Add Artifacts To The Grid

Artifacts include things like:

1. Walls
2. Doors and windows
3. Bedrooms and room areas
4. Kitchen pieces such as counters, islands, sinks, fridge, stove, and dishwasher
5. Bathroom pieces such as shower, toilet, bathtub, and sinks
6. Furniture such as beds, sofas, chairs, tables, desks, dressers, and shelving
7. Outdoor items and special spaces such as patio, loft, mudroom, pantry, garage, and utility room

When an artifact is placed on the grid, the actual icon appears on the plan along with its name and size.

### Use Ready-Made Room Kits

Some artifacts are full room kits instead of single pieces.

When you choose a room kit:

1. A checklist appears.
2. You can choose which furniture or appliances to include.
3. You can also choose how many doors and windows to include.
4. The app creates a typical version of that room and places it on the grid.

Room kits are useful when you want to place a complete room quickly and then customize it afterward.

### Draw Walls

Walls can be added and extended on the grid to form room shapes.

FloorCraft supports connected wall drawing so walls can be extended into continuous runs. When four walls form a rectangular room, the app treats that area as a room grouping so it can be moved together with what is inside it.

## Editing Items

### Select An Item

1. Click or tap an item on the grid.
2. Its details appear in the Inspector.

### Move An Item

1. Drag the item to a new location.
2. The position snaps to the grid.

### Resize An Item

1. Select the item.
2. Drag the resize handle, or
3. Enter a new width or depth in the Inspector.

FloorCraft supports measurements with one decimal place, such as `4.2 ft`.

### Rename An Item

1. Select the item.
2. Change its name in the Inspector.

The label on the grid updates to match.

### Change Size Or Position Precisely

You can edit:

1. Width
2. Depth
3. X position
4. Y position

These values use feet and support tenths.

### Change Appearance

You can update an item's color so it is easier to identify on the plan.

### Delete An Item

1. Select the item.
2. Use the delete control in the Inspector or on the item itself.

## Moving A Whole Room

Use `Move Room` when you want to reposition a room and everything inside it together.

Examples:

1. Move an ensuite bathroom to another part of the plan
2. Move a bedroom and its furniture together
3. Reposition a room kit after placing it

How it works:

1. Click `Move Room`.
2. Drag a selection box around the room area you want.
3. A highlighted outline appears around the selected room group.
4. Drag that outline to move the entire room.
5. Click `Move Room` again when you are finished.

If a room has been properly grouped, the walls and the items inside it move together.

## Grid Size And Zoom

### Grid Size

The `Grid` controls change the size of the available workspace.

This gives you more room to build larger plans or spread areas apart for easier editing.

### Zoom

The `Zoom` control changes how large the plan appears on screen.

Important:

Zoom changes the viewing size only. It does not change the true measurements of the layout.

This is useful when:

1. You want to inspect a detailed area more closely
2. You want to zoom out and see the whole plan
3. You are working on a touch device and want more visual space

You can also zoom with the mouse wheel plus `Ctrl` or `Cmd`, depending on your device.

## 3D View

The `3D View` button switches the floor plan into an overhead dollhouse-style view using the current grid layout.

This lets you:

1. See the arrangement from a more visual angle
2. Rotate the view
3. Better understand how the spaces relate to each other

While in 3D view:

1. Drag the grid to rotate the viewing angle
2. Use `Reset` to return to the default angle
3. Use `Exit` to return to normal editing

## Render View

The `Render View` button creates a rendered concept image based on:

1. The prompt you entered
2. The artifacts currently on the grid
3. Their positions and approximate layout

The rendered panel also shows the prompt used to create the image, and you can edit that prompt and use `Regenerate View` to try another version.

This is useful for getting a more polished design concept based on your current floor plan.

## Saving And Opening Plans

### Save Plan

`Save Plan` lets you store your current work for later.

On supported browsers, the app opens the normal system save dialog so you can choose where to save the file.

The plan is saved as a FloorCraft file with the `.floorcraft` extension.

### Open Plan

`Open Plan` lets you bring a previously saved FloorCraft file back into the app.

This works on Mac and Windows through the normal file picker.

## Export PNG

`Export PNG` saves an image version of the floor plan.

The exported image is meant to match what you see on the grid, including icons and visible labels.

This is useful when you want to:

1. Share a quick layout image
2. Keep a snapshot of a design option
3. Add the plan to notes, presentations, or renovation discussions

## Touch Screen Support

FloorCraft supports touch use as well as mouse use.

If your device supports both, you can use either one.

This includes:

1. Selecting items
2. Dragging items
3. Moving rooms
4. Working with the grid
5. Using the 3D view rotation

## Helpful Tips

1. Start with room shapes first, then add fixtures and furniture.
2. Use room kits when you want a fast starting point.
3. Increase grid size when the plan feels cramped.
4. Use zoom for detailed editing.
5. Use `Move Room` instead of moving one item at a time when a whole room needs to shift.
6. Save versions as you go if you want to compare different layout ideas.
7. Use `Render View` after the plan is mostly arranged so the image better matches your layout.

## If Something Is Not Working

### `Server API` Is Missing

The AI-powered features are not currently available.

This mainly affects:

1. `Generate`
2. `Render View`

Manual editing features should still work.

### Generate Or Render Does Not Work

Check that:

1. The app has access to its AI service
2. There is a valid plan or prompt to work from
3. The page has fully loaded

### I Need More Space

Try:

1. Increasing the grid size
2. Zooming out
3. Moving room groups apart

## Best First Exercise

If you are new to the app, try this:

1. Generate a simple room from a text prompt
2. Select one item and change its size
3. Add a new artifact from the left panel
4. Create a room kit
5. Move a room as a group
6. Save the plan
7. Re-open the saved plan
8. Export a PNG
9. Open `Render View`
10. Try `3D View`

After that, you will know the main FloorCraft workflow.
