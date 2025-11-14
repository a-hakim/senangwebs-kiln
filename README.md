# SenangWebs Kiln (SWK)

A lightweight, responsive 3D modeling editor library.

## Quick Start

### Installation

### Method 1: JavaScript API (Recommended)

examples/js-init.html

```html
<link rel="stylesheet" href="dist/swk.min.css">
<div id="cad"></div>
<script src="dist/swk.min.js"></script>
<script>
    const roll = new SWK('#cad', {
        viewportBackground: '#f0f0f0',
        grid: {
            show: true,
            centerColor: '#cccccc',
            linesColor: '#e0e0e0'
        },
        outlineColor: '#ff0000'
    });
</script>
```

### Method 2: HTML Data Attributes

examples/data-attributes.html

```html
<link rel="stylesheet" href="dist/swk.min.css">
<!-- Automatically initializes on page load - no JavaScript required! -->
<div data-swk data-swk-viewport-background="#f0f0f0"
     data-swk-grid-show="true"
     data-swk-grid-center-color="#cccccc"
     data-swk-grid-lines-color="#e0e0e0"
     data-swk-outline-color="#ff0000">
</div>
<script src="dist/swk.min.js"></script>
```

## License

MIT License - Feel free to use in your projects!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
