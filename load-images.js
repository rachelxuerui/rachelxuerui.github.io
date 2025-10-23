
(() => {
  // =========================
  // Dynamic Image Loading
  // =========================

  // Define the asset structure - update this as needed
  const assetPaths = [
    'assets/007 Townhouse in Tribeca I/images/',
    'assets/007 Townhouse in Tribeca I/construction/',
    'assets/007 Townhouse in Tribeca I/drawings'
  ];

  // Function to extract filename without extension
  const getPhotoName = (filepath) => {
    const filename = filepath.split('/').pop();
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  };

  // Function to extract folder name from path
  const getFolderName = (filepath) => {
    const parts = filepath.split('/');
    // Get the grandparent folder name if it exists, otherwise fall back to parent
    return parts[parts.length - 3] || parts[parts.length - 2] || 'unknown';
  };

  // Function to check if file is an image
  const isImageFile = (filename) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  // Function to convert folder name to URL slug
  const folderNameToSlug = (folderName) => {
    return folderName.toLowerCase().replace(/\s+/g, '-') + '.html';
  };

  // Function to create a cell element
  const createCell = (imagePath, photoName, folderName) => {
    const link = document.createElement('a');
    link.href = folderNameToSlug(folderName);

    const cell = document.createElement('div');
    cell.className = 'cell';

    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = photoName;
    img.dataset.name = folderName;

    cell.appendChild(img);
    link.appendChild(cell);
    return link;
  };

  // Main function to load images
  const loadImages = async () => {
    const content = document.querySelector('.content');
    if (!content) return;

    // Clear existing content except tooltip
    const tooltip = document.getElementById('tooltip');
    content.innerHTML = '';
    if (tooltip) content.appendChild(tooltip);

    // Collect all image files
    const allImages = [];

    for (const basePath of assetPaths) {
      try {
        // Fetch directory listing (this would need a server endpoint)
        // For now, we'll use a predefined list of images

        // Since we can't dynamically scan directories in the browser,
        // we'll use a manifest approach instead
        const response = await fetch(`${basePath}manifest.json`);
        if (response.ok) {
          const files = await response.json();
          files.forEach(filename => {
            if (isImageFile(filename)) {
              const imagePath = basePath + filename;
              allImages.push({
                path: imagePath,
                photoName: getPhotoName(filename),
                folderName: getFolderName(imagePath)
              });
            }
          });
        }
      } catch (error) {
        console.log(`Could not load manifest for ${basePath}`);
      }
    }

    // Create cells for all images
    allImages.forEach(img => {
      const cell = createCell(img.path, img.photoName, img.folderName);
      content.insertBefore(cell, tooltip);
    });
  };

  // Alternative: Static list approach (works without server-side directory listing)
  const loadImagesStatic = () => {
    const content = document.querySelector('.content');
    if (!content) return;

    // Clear existing content except tooltip
    const tooltip = document.getElementById('tooltip');
    content.innerHTML = '';

    // Define all your images here
    const images = [
      'assets/007 Townhouse in Tribeca I/images/007_cp_250725_ww-500.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250725_ww-502.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250725_ww-505.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250725_ww-507.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250725_ww-510.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250726_ww-514.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250726_ww-523.jpg',
      'assets/007 Townhouse in Tribeca I/images/007_cp_250726_ww-542.jpg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_L02240409_042.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_L02240627_080.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_L04240924_051.JPG',
      'assets/007 Townhouse in Tribeca I/construction/007_co_l01_240409_246.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_l01_240507_055.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_l01_240523_306.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_l01_240730_346.jpeg',
      'assets/007 Townhouse in Tribeca I/construction/007_co_l01_241024_411.jpeg',
      'assets/photo.png'
    ];

    images.forEach(imagePath => {
      const photoName = getPhotoName(imagePath);
      const folderName = getFolderName(imagePath);
      const cell = createCell(imagePath, photoName, folderName);
      content.appendChild(cell);
    });

    // Re-add tooltip at the end
    if (tooltip) content.appendChild(tooltip);

    // Setup infinite scroll after images are loaded
    setupInfiniteScroll();
  };

  // Infinite scroll setup (to work with dynamically loaded images)
  const setupInfiniteScroll = () => {
    const content = document.querySelector('.content');
    if (!content) return;

    // Get all cells except tooltip as template
    const templateCells = Array.from(content.children).filter(
      child => child.id !== 'tooltip'
    );

    const cloneCells = () => templateCells.map(cell => cell.cloneNode(true));

    content.addEventListener('scroll', () => {
      const scrollBottom = content.scrollTop + content.clientHeight;
      if (scrollBottom >= content.scrollHeight - 10) {
        const tooltip = document.getElementById('tooltip');
        cloneCells().forEach(clone => {
          // Insert before tooltip to keep it at the end
          if (tooltip) {
            content.insertBefore(clone, tooltip);
          } else {
            content.appendChild(clone);
          }
        });
      }
    }, { passive: true });
  };

  // Use the static approach by default (works without server-side support)
  loadImagesStatic();

  // If you have a backend that can provide directory listings, use:
  // loadImages();
})();

