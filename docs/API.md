# SenangWebs Kiln API Reference

Complete API documentation for SenangWebs Kiln (SWK) library.

## Table of Contents

- [Initialization](#initialization)
- [Configuration](#configuration)
- [Shape Methods](#shape-methods)
- [Selection Methods](#selection-methods)
- [Transform Methods](#transform-methods)
- [Group Methods](#group-methods)
- [History Methods](#history-methods)
- [Camera Methods](#camera-methods)
- [Export Methods](#export-methods)
- [Events](#events)
- [HTML Attributes](#html-attributes)

---

## Initialization

### `new SWK(selector, options)`

Creates a new SWK editor instance.

**Parameters:**
- `selector` (string|HTMLElement) - CSS selector or DOM element
- `options` (Object) - Configuration options (see [Configuration](#configuration))

**Returns:** SWK instance

**Example:**
```javascript
const editor = new SWK('#editor', {
    viewportBackground: '#e2e8f0',
    grid: { show: true }
});
```

### `SWK.autoInit()`

Automatically initializes all elements with `data-swk-init="true"` attribute.

**Returns:** Array of SWK instances

**Example:**
```javascript
const editors = SWK.autoInit();
console.log('Initialized', editors.length, 'editors');
```

---

## Configuration

Default configuration object structure:

```javascript
{
    // Container & Sizing
    container: null,           // Automatically set
    width: '100%',
    height: '100%',
    
    // Viewport Appearance
    viewportBackground: '#e2e8f0',
    outlineColor: '#10b981',
    outlineThickness: 2,
    
    // Grid
    grid: {
        show: true,
        size: 20,
        divisions: 20,
        centerColor: '#888888',
        linesColor: '#cccccc'
    },
    
    // Camera
    camera: {
        mode: 'perspective',   // 'perspective' | 'orthographic'
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [5, 5, 5]
    },
    
    // Transform
    transform: {
        mode: 'translate',     // 'translate' | 'rotate' | 'scale'
        space: 'local',        // 'local' | 'world'
        snapUnit: 0.1
    },
    
    // Lighting
    lighting: {
        ambient: {
            intensity: 0.5,
            color: '#ffffff'
        },
        directional: {
            intensity: 0.8,
            color: '#ffffff',
            position: [5, 5, 5]
        },
        castShadow: true
    },
    
    // UI Elements
    ui: {
        enabled: false,        // Enable full UI panels
        panels: {
            shapes: true,
            properties: true,
            outliner: true,
            controls: true
        }
    },
    
    // Features
    features: {
        grouping: true,
        undo: true,
        export: true
    },
    
    // History
    history: {
        enabled: true,
        maxSize: 50
    }
}
```

---

## Shape Methods

### `addShape(type, options)`

Creates and adds a shape to the scene.

**Parameters:**
- `type` (string) - Shape type: `'box'`, `'sphere'`, `'cylinder'`, `'cone'`, `'torus'`, `'plane'`, `'pyramid'`, `'torusknot'`, `'tetrahedron'`, `'octahedron'`, `'icosahedron'`, `'dodecahedron'`, `'text'`
- `options` (Object) - Shape-specific options

**Returns:** THREE.Mesh | null

**Shape Options:**

**Box:**
```javascript
editor.addShape('box', {
    width: 1,
    height: 1,
    depth: 1,
    color: 0x00ff00
});
```

**Sphere:**
```javascript
editor.addShape('sphere', {
    radius: 1,
    widthSegments: 32,
    heightSegments: 16,
    color: 0x00ff00
});
```

**Text:**
```javascript
editor.addShape('text', {
    text: 'Hello',
    fontSize: 1,
    fontType: 'sans', // 'sans', 'serif', 'mono'
    color: 0x00ff00
});
```

### `deleteObject(mesh)`

Deletes an object from the scene.

**Parameters:**
- `mesh` (THREE.Mesh|null) - Object to delete. If null, deletes selected object.

**Returns:** boolean - Success status

### `duplicateObject(mesh)`

Duplicates an object.

**Parameters:**
- `mesh` (THREE.Mesh|null) - Object to duplicate. If null, duplicates selected object.

**Returns:** THREE.Mesh | null - Duplicated object

### `getAllObjects()`

Gets all user-created objects in the scene.

**Returns:** Array<THREE.Mesh>

---

## Selection Methods

### `selectObject(mesh)`

Selects an object.

**Parameters:**
- `mesh` (THREE.Mesh) - Object to select

### `deselectAll()`

Clears all selections.

### `getSelectedObjects()`

Gets currently selected objects.

**Returns:** Array<THREE.Mesh>

### `getSelectedObject()`

Gets the first selected object.

**Returns:** THREE.Mesh | null

### `addToSelection(mesh)`

Adds an object to the current selection (multi-select).

**Parameters:**
- `mesh` (THREE.Mesh) - Object to add to selection

### `removeFromSelection(mesh)`

Removes an object from the selection.

**Parameters:**
- `mesh` (THREE.Mesh) - Object to remove from selection

---

## Transform Methods

### `setTransformMode(mode)`

Sets the transform mode.

**Parameters:**
- `mode` (string) - `'translate'`, `'rotate'`, or `'scale'`

**Emits:** `transformModeChanged`

### `getTransformMode()`

Gets the current transform mode.

**Returns:** string

### `setTransformSpace(space)`

Sets the transform space.

**Parameters:**
- `space` (string) - `'local'` or `'world'`

### `getTransformSpace()`

Gets the current transform space.

**Returns:** string

### `setSnapUnit(value)`

Sets the snap unit for translations.

**Parameters:**
- `value` (number) - Snap unit value (0 = off)

**Emits:** `snapUnitChanged`

### `getSnapUnit()`

Gets the current snap unit.

**Returns:** number

### `toggleSnap()`

Toggles snap on/off.

### `cycleSnapValue()`

Cycles through preset snap values (0.5, 0.2, 0.1, 0.05, 0.025, 0.01, 0).

---

## Group Methods

### `groupSelected()`

Groups all selected objects into a THREE.Group.

**Returns:** THREE.Group | null

**Emits:** `groupCreated`

### `ungroupSelected()`

Ungroups the selected group.

**Returns:** Array<THREE.Mesh> | null - Ungrouped objects

**Emits:** `groupRemoved`

### `isGroupContainer(object)`

Checks if an object is a group container.

**Parameters:**
- `object` (THREE.Object3D) - Object to check

**Returns:** boolean

### `getAllGroups()`

Gets all groups in the scene.

**Returns:** Array<THREE.Group>

### `getGroupChildren(group)`

Gets all children of a group.

**Parameters:**
- `group` (THREE.Group) - Group to query

**Returns:** Array<THREE.Mesh>

---

## History Methods

### `undo()`

Undoes the last action.

**Returns:** boolean - Success status

**Emits:** `historyRestored`

### `redo()`

Redoes the last undone action.

**Returns:** boolean - Success status

**Emits:** `historyRestored`

### `canUndo()`

Checks if undo is available.

**Returns:** boolean

### `canRedo()`

Checks if redo is available.

**Returns:** boolean

### `captureState(description)`

Manually captures the current state.

**Parameters:**
- `description` (string) - Description of the action

**Returns:** boolean - Success status

### `clearHistory()`

Clears the undo/redo history.

---

## Camera Methods

### `setCameraMode(mode)`

Sets the camera mode.

**Parameters:**
- `mode` (string) - `'perspective'` or `'orthographic'`

**Emits:** `cameraModeChanged`

### `getCameraMode()`

Gets the current camera mode.

**Returns:** string

### `resetCamera()`

Resets camera to initial position.

### `setBackground(color)`

Sets the viewport background color.

**Parameters:**
- `color` (string|number) - Color value (hex string or number)

---

## Export Methods

### `exportGLTF(options)`

Exports the scene as GLTF (JSON) format.

**Parameters:**
- `options` (Object)
  - `filename` (string) - Custom filename (without extension)

**Returns:** Promise<boolean>

**Emits:** `exportStart`, `exportComplete`, `exportError`

**Example:**
```javascript
await editor.exportGLTF({ filename: 'my-scene' });
// Downloads: my-scene.gltf
```

### `exportGLB(options)`

Exports the scene as GLB (binary GLTF) format.

**Parameters:**
- `options` (Object)
  - `filename` (string) - Custom filename (without extension)

**Returns:** Promise<boolean>

**Example:**
```javascript
await editor.exportGLB({ filename: 'my-scene' });
// Downloads: my-scene.glb
```

### `exportSTL(options)`

Exports the scene as STL format.

**Parameters:**
- `options` (Object)
  - `filename` (string) - Custom filename (without extension)
  - `binary` (boolean) - Export as binary STL (default: true)

**Returns:** Promise<boolean>

**Example:**
```javascript
await editor.exportSTL({ filename: 'my-scene', binary: true });
// Downloads: my-scene.stl
```

### `exportSelected(format, options)`

Exports only selected objects.

**Parameters:**
- `format` (string) - `'gltf'`, `'glb'`, or `'stl'`
- `options` (Object) - Same as individual export methods

**Returns:** Promise<boolean>

**Example:**
```javascript
// Select some objects first
editor.selectObject(box);
await editor.exportSelected('gltf', { filename: 'selected-objects' });
```

### `getAvailableExportFormats()`

Gets list of available export formats.

**Returns:** Array<Object>

**Example:**
```javascript
const formats = editor.getAvailableExportFormats();
// [
//   { format: 'gltf', name: 'GLTF (JSON)', extension: 'gltf' },
//   { format: 'glb', name: 'GLB (Binary)', extension: 'glb' },
//   { format: 'stl', name: 'STL', extension: 'stl' }
// ]
```

---

## Events

Subscribe to events using the `on()` method:

```javascript
editor.on('eventName', (data) => {
    console.log(data);
});
```

### Core Events

**`initialized`**
Fired when editor is fully initialized.

**`objectAdded`**
- `object` (THREE.Mesh) - The added object

**`objectRemoved`**
- `object` (THREE.Mesh) - The removed object

**`selectionChanged`**
- `selected` (Array<THREE.Mesh>) - Currently selected objects
- `deselected` (Array<THREE.Mesh>) - Previously selected objects

### Transform Events

**`transformModeChanged`**
- `mode` (string) - New transform mode

**`snapUnitChanged`**
- `value` (number) - New snap unit value

### Camera Events

**`cameraModeChanged`**
- `mode` (string) - New camera mode

### Group Events

**`groupCreated`**
- `group` (THREE.Group) - The created group

**`groupRemoved`**
- `group` (THREE.Group) - The removed group

### History Events

**`historyChanged`**
- `canUndo` (boolean) - Whether undo is available
- `canRedo` (boolean) - Whether redo is available
- `undoCount` (number) - Number of undo actions
- `redoCount` (number) - Number of redo actions

**`historyRestored`**
- `action` (string) - `'undo'` or `'redo'`
- `description` (string) - Action description

### Export Events

**`exportStart`**
- `format` (string) - Export format

**`exportComplete`**
- `format` (string) - Export format
- `filename` (string) - Downloaded filename
- `objectCount` (number) - Number of exported objects

**`exportError`**
- `format` (string) - Export format
- `error` (string) - Error message

---

## HTML Attributes

Initialize SWK using HTML `data-*` attributes:

### Basic Attributes

```html
<div id="editor"
     data-swk-init="true"
     data-swk-width="100%"
     data-swk-height="100%"
     data-swk-viewport-background="#e2e8f0"
     data-swk-outline-color="#10b981">
</div>
```

### Grid Attributes

```html
data-swk-grid-show="true"
data-swk-grid-size="20"
data-swk-grid-divisions="20"
data-swk-grid-center-color="#888888"
data-swk-grid-lines-color="#cccccc"
```

### Camera Attributes

```html
data-swk-camera-mode="perspective"
data-swk-camera-fov="75"
data-swk-camera-position="5,5,5"
```

### Transform Attributes

```html
data-swk-transform-mode="translate"
data-swk-transform-space="local"
data-swk-snap-unit="0.1"
```

### UI Attributes

```html
data-swk-ui-enabled="true"
data-swk-ui-panels-shapes="true"
data-swk-ui-panels-properties="true"
data-swk-ui-panels-outliner="true"
data-swk-ui-panels-controls="true"
```

### Feature Attributes

```html
data-swk-history-enabled="true"
data-swk-history-max-size="50"
data-swk-features-grouping="true"
data-swk-features-undo="true"
data-swk-features-export="true"
```

### Complete Example

```html
<div id="editor"
     data-swk-init="true"
     data-swk-viewport-background="#f0f0f0"
     data-swk-grid-show="true"
     data-swk-camera-mode="perspective"
     data-swk-camera-position="5,5,5"
     data-swk-ui-enabled="true"
     data-swk-history-enabled="true">
</div>
```

---

## Advanced Usage

### Custom Event Handling

```javascript
const editor = new SWK('#editor');

// Multiple event listeners
editor.on('objectAdded', (object) => {
    console.log('Added:', object.name);
});

editor.on('selectionChanged', (selected, deselected) => {
    console.log('Selected:', selected.length);
    console.log('Deselected:', deselected.length);
});

// Remove event listener
const handler = (object) => console.log(object);
editor.on('objectAdded', handler);
editor.off('objectAdded', handler);
```

### Programmatic Object Manipulation

```javascript
// Create and position shapes
const box = editor.addShape('box');
box.position.set(2, 0, 0);
box.rotation.y = Math.PI / 4;
box.scale.set(1.5, 1.5, 1.5);

// Change material
box.material.color.set(0xff0000);
box.material.opacity = 0.5;
box.material.transparent = true;

// Update history after changes
editor.captureState('Modified box');
```

### Custom Export Workflow

```javascript
// Export with custom filename
await editor.exportGLTF({ 
    filename: `project-${Date.now()}` 
});

// Export only selected objects
editor.selectObject(box);
editor.addToSelection(sphere);
await editor.exportSelected('glb');

// Handle export events
editor.on('exportStart', ({ format }) => {
    console.log(`Starting ${format} export...`);
});

editor.on('exportComplete', ({ filename, objectCount }) => {
    console.log(`Exported ${objectCount} objects to ${filename}`);
});

editor.on('exportError', ({ error }) => {
    console.error(`Export failed: ${error}`);
});
```

---

## Type Definitions (TypeScript)

```typescript
interface SWKOptions {
    width?: string;
    height?: string;
    viewportBackground?: string;
    outlineColor?: string;
    grid?: {
        show?: boolean;
        size?: number;
        divisions?: number;
        centerColor?: string;
        linesColor?: string;
    };
    camera?: {
        mode?: 'perspective' | 'orthographic';
        fov?: number;
        position?: [number, number, number];
    };
    ui?: {
        enabled?: boolean;
        panels?: {
            shapes?: boolean;
            properties?: boolean;
            outliner?: boolean;
            controls?: boolean;
        };
    };
    history?: {
        enabled?: boolean;
        maxSize?: number;
    };
}

class SWK extends EventEmitter {
    constructor(selector: string | HTMLElement, options?: SWKOptions);
    
    // Shape methods
    addShape(type: string, options?: object): THREE.Mesh | null;
    deleteObject(mesh?: THREE.Mesh): boolean;
    duplicateObject(mesh?: THREE.Mesh): THREE.Mesh | null;
    getAllObjects(): THREE.Mesh[];
    
    // Selection methods
    selectObject(mesh: THREE.Mesh): void;
    deselectAll(): void;
    getSelectedObjects(): THREE.Mesh[];
    
    // Transform methods
    setTransformMode(mode: 'translate' | 'rotate' | 'scale'): void;
    setSnapUnit(value: number): void;
    
    // Group methods
    groupSelected(): THREE.Group | null;
    ungroupSelected(): THREE.Mesh[] | null;
    
    // History methods
    undo(): boolean;
    redo(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
    
    // Export methods
    exportGLTF(options?: object): Promise<boolean>;
    exportGLB(options?: object): Promise<boolean>;
    exportSTL(options?: object): Promise<boolean>;
    
    // Camera methods
    setCameraMode(mode: 'perspective' | 'orthographic'): void;
    resetCamera(): void;
    
    // Lifecycle
    destroy(): void;
    
    // Static methods
    static autoInit(): SWK[];
}
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES6+ support and WebGL.

---

## Performance Tips

1. **Limit History Size**: Reduce `history.maxSize` for better memory usage
2. **Disable UI**: Set `ui.enabled: false` for better performance in production
3. **Reduce Grid Divisions**: Lower `grid.divisions` for complex scenes
4. **Use Binary Export**: Use GLB instead of GLTF for smaller file sizes
5. **Dispose Unused Objects**: Call `editor.deleteObject()` instead of just hiding

---

For more information, see [README.md](../README.md) or visit the [examples](../examples/) folder.
