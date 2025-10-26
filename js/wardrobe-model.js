// Готовая 3D модель шкафа в формате GLTF
const wardrobeGltfModel = {
    "asset": {
        "version": "2.0",
        "generator": "Pickawood Configurator Local"
    },
    "scene": 0,
    "scenes": [{
        "nodes": [0, 1, 2, 3]
    }],
    "nodes": [
        {
            "name": "Wardrobe_Base",
            "mesh": 0,
            "translation": [0, 0, 0]
        },
        {
            "name": "Wardrobe_Doors",
            "mesh": 1,
            "translation": [0, 0, 0]
        },
        {
            "name": "Wardrobe_Shelves",
            "mesh": 2,
            "translation": [0, 0, 0]
        },
        {
            "name": "Wardrobe_Hanging_Rod",
            "mesh": 3,
            "translation": [0, 0, 0]
        }
    ],
    "meshes": [
        {
            "name": "Base",
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1
                },
                "indices": 2
            }]
        },
        {
            "name": "Doors",
            "primitives": [{
                "attributes": {
                    "POSITION": 3,
                    "NORMAL": 4
                },
                "indices": 5
            }]
        },
        {
            "name": "Shelves",
            "primitives": [{
                "attributes": {
                    "POSITION": 6,
                    "NORMAL": 7
                },
                "indices": 8
            }]
        },
        {
            "name": "Hanging_Rod",
            "primitives": [{
                "attributes": {
                    "POSITION": 9,
                    "NORMAL": 10
                },
                "indices": 11
            }]
        }
    ],
    "accessors": [
        // Base vertices
        {
            "bufferView": 0,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3",
            "max": [1.0, 0.1, 0.5],
            "min": [0.0, 0.0, 0.0]
        },
        // Base normals
        {
            "bufferView": 1,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3"
        },
        // Base indices
        {
            "bufferView": 2,
            "componentType": 5123,
            "count": 36,
            "type": "SCALAR"
        },
        // Doors vertices
        {
            "bufferView": 3,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3",
            "max": [1.0, 2.0, 0.05],
            "min": [0.0, 0.0, 0.0]
        },
        // Doors normals
        {
            "bufferView": 4,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3"
        },
        // Doors indices
        {
            "bufferView": 5,
            "componentType": 5123,
            "count": 36,
            "type": "SCALAR"
        },
        // Shelves vertices
        {
            "bufferView": 6,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3",
            "max": [0.9, 0.05, 0.4],
            "min": [0.1, 0.0, 0.1]
        },
        // Shelves normals
        {
            "bufferView": 7,
            "componentType": 5126,
            "count": 8,
            "type": "VEC3"
        },
        // Shelves indices
        {
            "bufferView": 8,
            "componentType": 5123,
            "count": 36,
            "type": "SCALAR"
        },
        // Hanging rod vertices
        {
            "bufferView": 9,
            "componentType": 5126,
            "count": 2,
            "type": "VEC3",
            "max": [0.9, 1.8, 0.25],
            "min": [0.1, 1.8, 0.25]
        },
        // Hanging rod normals
        {
            "bufferView": 10,
            "componentType": 5126,
            "count": 2,
            "type": "VEC3"
        },
        // Hanging rod indices
        {
            "bufferView": 11,
            "componentType": 5123,
            "count": 2,
            "type": "SCALAR"
        }
    ],
    "bufferViews": [
        // Base vertices
        { "buffer": 0, "byteOffset": 0, "byteLength": 96 },
        // Base normals
        { "buffer": 0, "byteOffset": 96, "byteLength": 96 },
        // Base indices
        { "buffer": 0, "byteOffset": 192, "byteLength": 72 },
        // Doors vertices
        { "buffer": 0, "byteOffset": 264, "byteLength": 96 },
        // Doors normals
        { "buffer": 0, "byteOffset": 360, "byteLength": 96 },
        // Doors indices
        { "buffer": 0, "byteOffset": 456, "byteLength": 72 },
        // Shelves vertices
        { "buffer": 0, "byteOffset": 528, "byteLength": 96 },
        // Shelves normals
        { "buffer": 0, "byteOffset": 624, "byteLength": 96 },
        // Shelves indices
        { "buffer": 0, "byteOffset": 720, "byteLength": 72 },
        // Hanging rod vertices
        { "buffer": 0, "byteOffset": 792, "byteLength": 24 },
        // Hanging rod normals
        { "buffer": 0, "byteOffset": 816, "byteLength": 24 },
        // Hanging rod indices
        { "buffer": 0, "byteOffset": 840, "byteLength": 4 }
    ],
    "buffers": [{
        "byteLength": 844,
        "uri": "data:application/octet-stream;base64," + btoa(
            // Простая геометрия шкафа (база, двери, полки, штанга)
            new Float32Array([
                // Base vertices (8 точек)
                0,0,0, 1,0,0, 1,0.1,0, 0,0.1,0,
                0,0,0.5, 1,0,0.5, 1,0.1,0.5, 0,0.1,0.5,
                // Base normals
                0,-1,0, 0,-1,0, 0,1,0, 0,1,0,
                0,-1,0, 0,-1,0, 0,1,0, 0,1,0,
                // Doors vertices (8 точек)
                0,0,0, 1,0,0, 1,2,0, 0,2,0,
                0,0,0.05, 1,0,0.05, 1,2,0.05, 0,2,0.05,
                // Doors normals
                0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
                0,0,1, 0,0,1, 0,0,1, 0,0,1,
                // Shelves vertices (8 точек)
                0.1,0.5,0.1, 0.9,0.5,0.1, 0.9,0.55,0.1, 0.1,0.55,0.1,
                0.1,0.5,0.4, 0.9,0.5,0.4, 0.9,0.55,0.4, 0.1,0.55,0.4,
                // Shelves normals
                0,-1,0, 0,-1,0, 0,1,0, 0,1,0,
                0,-1,0, 0,-1,0, 0,1,0, 0,1,0,
                // Hanging rod vertices (2 точки)
                0.1,1.8,0.25, 0.9,1.8,0.25,
                // Hanging rod normals
                0,1,0, 0,1,0
            ]).buffer +
            new Uint16Array([
                // Base indices (12 треугольников)
                0,1,2, 0,2,3, 4,7,6, 4,6,5,
                0,4,5, 0,5,1, 2,6,7, 2,7,3,
                0,3,7, 0,7,4, 1,5,6, 1,6,2,
                // Doors indices (12 треугольников)
                0,1,2, 0,2,3, 4,7,6, 4,6,5,
                0,4,5, 0,5,1, 2,6,7, 2,7,3,
                0,3,7, 0,7,4, 1,5,6, 1,6,2,
                // Shelves indices (12 треугольников)
                0,1,2, 0,2,3, 4,7,6, 4,6,5,
                0,4,5, 0,5,1, 2,6,7, 2,7,3,
                0,3,7, 0,7,4, 1,5,6, 1,6,2,
                // Hanging rod indices (1 линия)
                0,1
            ]).buffer
        )
    }]
};

