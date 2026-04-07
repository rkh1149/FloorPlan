# FloorCraft User Guide

This guide is for someone using FloorCraft for the first time.

## What the app does

FloorCraft lets you:

1. Generate a floor plan from a text description
2. Drag furniture, walls, and fixtures onto the grid
3. Move, resize, rotate, recolor, and relabel items
4. Move an entire room selection as one group
5. Zoom in and out while keeping real dimensions in feet
6. Create four photoreal concept views from the floor plan
7. Export the floor plan as a PNG image

## Before you start

When the app is working correctly in Codespaces:

1. Open the shared app URL in your browser
2. Check the `Server API` button near the top
3. If it says `Server API Ready`, you can use the app normally
4. If it says `Server API Missing`, the repo owner needs to fix the Codespaces server setup before OpenAI features will work

## Main areas of the screen

### Top bar

The top bar contains:

1. The prompt box where you describe the space you want
2. `Generate` to create a floor plan from your text
3. `Grid` width and height controls in feet
4. `Zoom` percentage
5. `Server API` status
6. `Render 4 Views`
7. `Move Room`
8. `Clear`
9. `Export PNG`

### Left panel

The left panel is the parts library. It includes walls, doors, windows, furniture, kitchen items, bathroom items, and general room objects.

### Center canvas

The center is the drawing grid. Each grid cell represents 1 foot.

### Right panel

The right panel is the Inspector. When you click an item, you can edit its details there.

## Quick start

### Option 1: Generate a plan from text

1. Click in the prompt box at the top
2. Type a description such as:
   `A master bedroom with ensuite and walk-in closet`
3. Click `Generate`
4. Wait for the plan to appear on the grid

### Option 2: Build manually

1. Drag items from the left panel onto the grid
2. Place walls first
3. Add doors, windows, and fixtures
4. Add furniture and room details

## How to edit items

### Select an item

1. Click any object on the grid
2. The Inspector on the right will open for that item

### Move an item

1. Click and drag the item on the grid
2. It will snap to the grid automatically

### Resize an item

1. Select the item
2. Drag the resize handle at the bottom-right corner
3. Or change `Width` and `Depth` in the Inspector

### Rename or add notes

1. Select the item
2. Use the `Label` and `Notes` fields in the Inspector

### Change position precisely

1. Select the item
2. In the Inspector, edit `X` and `Y`
3. These values are in feet

### Rotate an item

1. Select the item
2. Click `Rotate 90°` in the Inspector

### Change the color

1. Select the item
2. Click a color swatch in the Inspector

### Delete an item

1. Select the item
2. Click `Delete` in the Inspector
3. You can also use the small delete circle that appears on the selected item

## How to move a whole room

Use this when you want to move a bathroom, ensuite, bedroom area, or another group of items together.

1. Click `Move Room`
2. Drag a selection box around the room area you want to move
3. A highlighted outline will appear around the selected group
4. Drag the highlighted outline to the new location
5. Click `Move Room` again to leave room-move mode

Tip:
Press `Escape` to exit room-move mode.

## Grid size and zoom

### Change grid size

Use the `Grid` controls at the top to change the total workspace size in feet.

Example:

1. Set width to `100`
2. Set height to `80`
3. The canvas will expand so you have more room to work

### Zoom in or out

Use the `Zoom` control to make the plan appear larger or smaller on screen without changing actual room dimensions.

You can also use:

1. `Ctrl + mouse wheel`
2. `Cmd + mouse wheel` on Mac

Important:
Zoom changes the display size only. It does not change the real measured size of the floor plan.

## Render photoreal views

You can create four concept images from the current floor plan:

1. North view
2. South view
3. East view
4. West view

To use it:

1. Build or generate a floor plan
2. Click `Render 4 Views`
3. Wait while the four images are generated
4. Use the download button under each image if you want to save it

These are concept renders based on the layout. They are not construction drawings.

## Export the floor plan

To save the visible plan as an image:

1. Click `Export PNG`
2. The app downloads a PNG of the current floor plan

## Clear the canvas

To remove everything and start over:

1. Click `Clear`
2. This removes all items from the grid
3. It also clears the current render previews

## Helpful tips

1. Start with the overall room shape first, then place fixtures and furniture
2. Use the Inspector when you need precise measurements
3. Increase the grid size if you run out of room
4. Use zoom to work comfortably on detailed areas
5. Use room-move mode for grouped spaces instead of moving items one by one

## Troubleshooting

### The app says `Server API Missing`

The Codespaces backend is not configured correctly. The repo owner needs to make sure the server is running and the OpenAI key is available to the Codespace.

### Generate does nothing

Make sure:

1. You typed something in the prompt box
2. The `Server API` button says `Server API Ready`

### Render 4 Views does not work

Make sure:

1. There is a floor plan on the canvas
2. The `Server API` button says `Server API Ready`
3. The Codespaces server is still running

### The layout feels crowded

Try:

1. Increasing the grid size
2. Zooming out
3. Moving one room at a time using `Move Room`

## Best way to learn the app

If this is your first time, try this:

1. Generate a simple room like `A small bathroom with shower, toilet, sink, and linen closet`
2. Click one item and edit it in the Inspector
3. Drag a new object from the left panel onto the grid
4. Change the grid size
5. Zoom in
6. Turn on `Move Room` and move the whole selection
7. Render the 4 photoreal views
8. Export the PNG

After that, you will know the full workflow.
